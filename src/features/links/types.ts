export interface Category {
  category_id: string; // mapped from id
  title: string;
  weight: number;
  timestamp: string; // mapped from createdAt
}

export interface Folder {
  folder_id: string; // id
  category_id: string | null;
  title: string;
  weight: number;
  timestamp: string;
}

export interface Subheading {
  subheading_id: string;
  folder_id: string;
  title: string;
  weight: number;
  timestamp: string;
}

export interface Link {
  link_id: string;
  folder_id: string | null;
  subheading_id: string | null;
  title: string;
  link: string;
  weight: number;
  timestamp: string;
}

// Responses
export interface LinksHomepageData {
  categories: Category[];
  folders: Folder[];
  general_links: Link[];
}

export interface FolderDetailData {
  folder: Folder;
  subheadings: (Subheading & { links: Link[] })[];
  direct_links: Link[];
}

// Requests
export interface CreateCategoryRequest {
  title: string;
  weight: number;
}

export type UpdateCategoryRequest = Partial<CreateCategoryRequest>;

export interface CreateFolderRequest {
  title: string;
  weight: number;
  category_id: string;
}

export type UpdateFolderRequest = Partial<CreateFolderRequest>;

export interface CreateSubheadingRequest {
  folder_id: string;
  title: string;
  weight: number;
}

export type UpdateSubheadingRequest = Partial<CreateSubheadingRequest>;

export interface CreateLinkRequest {
  folder_id?: string | null;
  subheading_id?: string | null;
  title: string;
  link: string; // url
  weight: number;
}

export type UpdateLinkRequest = Partial<CreateLinkRequest>;

// DB Models (Prisma shapes)
  export interface CategoryModel {
  id: string;
  title: string;
  weight: number;
  createdAt: Date;
}

export interface FolderModel {
  id: string;
  categoryId: string;
  title: string;
  weight: number;
  createdAt: Date;
}

export interface SubheadingModel {
  id: string;
  folderId: string;
  title: string;
  weight: number;
  createdAt: Date;
}

export interface LinkModel {
  id: string;
  folderId: string | null;
  subheadingId: string | null;
  title: string;
  url: string;
  weight: number;
  createdAt: Date;
}
