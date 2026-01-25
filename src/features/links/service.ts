import { Prisma } from '@prisma/client';
import prisma from '../../utils/db.js';
import {
  Category,
  Folder,
  Subheading,
  Link,
  LinksHomepageData,
  FolderDetailData,
  CreateCategoryRequest,
  UpdateCategoryRequest,
  CreateFolderRequest,
  UpdateFolderRequest,
  CreateSubheadingRequest,
  UpdateSubheadingRequest,
  CreateLinkRequest,
  UpdateLinkRequest,
  CategoryModel,
  FolderModel,
  SubheadingModel,
  LinkModel
} from './types.js';

export class LinksService {
  // Private Mappers
  private toCategoryDTO(item: CategoryModel): Category {
    return {
      category_id: item.id,
      title: item.title,
      weight: item.weight,
      timestamp: item.createdAt.toISOString()
    };
  }

  private toFolderDTO(item: FolderModel): Folder {
    return {
      folder_id: item.id,
      category_id: item.categoryId,
      title: item.title,
      weight: item.weight,
      timestamp: item.createdAt.toISOString()
    };
  }

  private toSubheadingDTO(item: SubheadingModel): Subheading {
    return {
      subheading_id: item.id,
      folder_id: item.folderId,
      title: item.title,
      weight: item.weight,
      timestamp: item.createdAt.toISOString()
    };
  }

  private toLinkDTO(item: LinkModel): Link {
    return {
      link_id: item.id,
      folder_id: item.folderId,
      subheading_id: item.subheadingId,
      title: item.title,
      link: item.url,
      weight: item.weight,
      timestamp: item.createdAt.toISOString()
    };
  }

  // Public
  async getHomepageData(): Promise<LinksHomepageData> {
    // using as unknown as Type is a workaround since prisma types are not generated yet, 
    // but the user wants to avoid 'any'.
    // However, defining return types on variables explicitly is safer.
    // Since 'prisma.category.findMany' returns a Promise of something that is NOT CategoryModel until generated, 
    // typescript will complain if I just say ": CategoryModel[]".
    // It will say "Type 'GetResult...' is not assignable to type 'CategoryModel[]'".
    // So I must cast it. "as unknown as CategoryModel[]" is safe here because I know the schema.
    
    const categories = await prisma.category.findMany({ orderBy: { weight: 'desc' } }) as unknown as CategoryModel[];
    const folders = await prisma.folder.findMany({ orderBy: { weight: 'desc' } }) as unknown as FolderModel[];
    const generalLinks = await prisma.link.findMany({
      where: { folderId: null },
      orderBy: { weight: 'desc' }
    }) as unknown as LinkModel[];

    return {
      categories: categories.map(c => this.toCategoryDTO(c)),
      folders: folders.map(f => this.toFolderDTO(f)),
      general_links: generalLinks.map(l => this.toLinkDTO(l))
    };
  }

  async getFolderDetail(folderId: string): Promise<FolderDetailData | null> {
    const folder = await prisma.folder.findUnique({ where: { id: folderId } }) as unknown as FolderModel | null;
    if (!folder) return null;

    const subheadings = await prisma.subheading.findMany({
      where: { folderId },
      orderBy: { weight: 'desc' },
      include: {
        links: {
          orderBy: { weight: 'desc' }
        }
      }
    }) as unknown as (SubheadingModel & { links: LinkModel[] })[];

    const directLinks = await prisma.link.findMany({
      where: { folderId, subheadingId: null },
      orderBy: { weight: 'desc' }
    }) as unknown as LinkModel[];

    return {
      folder: this.toFolderDTO(folder),
      subheadings: subheadings.map(s => ({
        ...this.toSubheadingDTO(s),
        links: s.links.map(l => this.toLinkDTO(l))
      })),
      direct_links: directLinks.map(l => this.toLinkDTO(l))
    };
  }

  // Admin - Categories
  async getAllCategories(): Promise<Category[]> {
    const items = await prisma.category.findMany({ orderBy: { weight: 'desc' } }) as unknown as CategoryModel[];
    return items.map(c => this.toCategoryDTO(c));
  }

  async getCategory(id: string): Promise<Category | null> {
    const item = await prisma.category.findUnique({ where: { id } }) as unknown as CategoryModel | null;
    return item ? this.toCategoryDTO(item) : null;
  }

  async createCategory(data: CreateCategoryRequest): Promise<Category> {
    const item = await prisma.category.create({ data }) as unknown as CategoryModel;
    return this.toCategoryDTO(item);
  }

  async updateCategory(id: string, data: UpdateCategoryRequest): Promise<Category> {
    const item = await prisma.category.update({ where: { id }, data }) as unknown as CategoryModel;
    return this.toCategoryDTO(item);
  }

  async deleteCategory(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }

  // Admin - Folders
  async getAllFolders(categoryId?: string): Promise<Folder[]> {
    const where = categoryId ? { categoryId } : {};
    const items = await prisma.folder.findMany({ where, orderBy: { weight: 'desc' } }) as unknown as FolderModel[];
    return items.map(f => this.toFolderDTO(f));
  }

  async getFolder(id: string): Promise<Folder | null> {
    const item = await prisma.folder.findUnique({ where: { id } }) as unknown as FolderModel | null;
    return item ? this.toFolderDTO(item) : null;
  }

  async createFolder(data: CreateFolderRequest): Promise<Folder> {
    const item = await prisma.folder.create({
      data: {
        title: data.title,
        weight: data.weight,
        category: { connect: { id: data.category_id } }
      }
    }) as unknown as FolderModel;
    return this.toFolderDTO(item);
  }

  async updateFolder(id: string, data: UpdateFolderRequest): Promise<Folder> {
    const updateData: Prisma.FolderUpdateInput = {};
    
    if (data.title) updateData.title = data.title;
    if (data.weight) updateData.weight = data.weight;
    
    if (data.category_id) {
       updateData.category = { connect: { id: data.category_id } };
    }
    const item = await prisma.folder.update({ where: { id }, data: updateData }) as unknown as FolderModel;
    return this.toFolderDTO(item);
  }

  async deleteFolder(id: string): Promise<void> {
    await prisma.folder.delete({ where: { id } });
  }

  // Admin - Subheadings
  async getAllSubheadings(): Promise<Subheading[]> {
     const items = await prisma.subheading.findMany({
       orderBy: { weight: 'desc' },
       include: { folder: { select: { title: true } } }
     }) as unknown as SubheadingModel[];
     return items.map(s => this.toSubheadingDTO(s));
  }

  async getSubheading(id: string): Promise<Subheading | null> {
    const item = await prisma.subheading.findUnique({ where: { id } }) as unknown as SubheadingModel | null;
    return item ? this.toSubheadingDTO(item) : null;
  }

  async createSubheading(data: CreateSubheadingRequest): Promise<Subheading> {
    const item = await prisma.subheading.create({
      data: {
        title: data.title,
        weight: data.weight,
        folder: { connect: { id: data.folder_id } }
      }
    }) as unknown as SubheadingModel;
    return this.toSubheadingDTO(item);
  }

  async updateSubheading(id: string, data: UpdateSubheadingRequest): Promise<Subheading> {
    const updateData: Prisma.SubheadingUpdateInput = {};
    if (data.title) updateData.title = data.title;
    if (data.weight) updateData.weight = data.weight;

    if (data.folder_id) {
      updateData.folder = { connect: { id: data.folder_id } };
    }
    const item = await prisma.subheading.update({ where: { id }, data: updateData }) as unknown as SubheadingModel;
    return this.toSubheadingDTO(item);
  }

  async deleteSubheading(id: string): Promise<void> {
    await prisma.subheading.delete({ where: { id } });
  }

  // Admin - Links (Items)
  async getAllLinks(): Promise<Link[]> {
    const items = await prisma.link.findMany({ orderBy: { weight: 'desc' } }) as unknown as LinkModel[];
    return items.map(l => this.toLinkDTO(l));
  }

  async getLink(id: string): Promise<Link | null> {
    const item = await prisma.link.findUnique({ where: { id } }) as unknown as LinkModel | null;
    return item ? this.toLinkDTO(item) : null;
  }

  async createLink(data: CreateLinkRequest): Promise<Link> {
    const createData: Prisma.LinkCreateInput = {
      title: data.title,
      url: data.link, // map `link` to `url`
      weight: data.weight
    };

    if (data.folder_id) {
      createData.folder = { connect: { id: data.folder_id } };
    }
    if (data.subheading_id) {
      createData.subheading = { connect: { id: data.subheading_id } };
    }

    const item = await prisma.link.create({ data: createData }) as unknown as LinkModel;
    return this.toLinkDTO(item);
  }

  async updateLink(id: string, data: UpdateLinkRequest): Promise<Link> {
     const updateData: Prisma.LinkUpdateInput = {};
     if (data.title !== undefined) updateData.title = data.title;
     if (data.link !== undefined) updateData.url = data.link; // map
     if (data.weight !== undefined) updateData.weight = data.weight;

     if (data.folder_id !== undefined) {
        if (data.folder_id === null) {
            updateData.folder = { disconnect: true };
        } else {
            updateData.folder = { connect: { id: data.folder_id } };
        }
     }
     
     if (data.subheading_id !== undefined) {
        if (data.subheading_id === null) {
            updateData.subheading = { disconnect: true };
        } else {
            updateData.subheading = { connect: { id: data.subheading_id } };
        }
     }

     const item = await prisma.link.update({ where: { id }, data: updateData }) as unknown as LinkModel;
     return this.toLinkDTO(item);
  }

  async deleteLink(id: string): Promise<void> {
    await prisma.link.delete({ where: { id } });
  }
}
