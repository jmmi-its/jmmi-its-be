import { Request, Response } from 'express';
import { LinksService } from './service.js';

export class LinksController {
  private service: LinksService;

  constructor() {
    this.service = new LinksService();
  }

  // --- Public / Aggregated Views ---

  getHomepage = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getHomepageData();
      res.json({ status: true, message: 'Homepage data retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error fetching homepage data', error });
    }
  };

  getFolderDetail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.getFolderDetail(id);
      if (!data) {
        res.status(404).json({ status: false, message: 'Folder not found' });
        return;
      }
      res.json({ status: true, message: 'Folder detail retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error fetching folder detail', error });
    }
  };

  // --- Categories ---

  getAllCategories = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getAllCategories();
      res.json({ status: true, message: 'Categories retrieved', data });
    } catch (error) {
       res.status(500).json({ status: false, message: 'Error', error });
    }
  };

  getCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.getCategory(id);
      if (!data) {
        res.status(404).json({ status: false, message: 'Category not found' });
        return;
      }
      res.json({ status: true, message: 'Category retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error', error });
    }
  };

  createCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.createCategory(req.body);
      res.status(201).json({ status: true, message: 'Category created', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error creating category', error });
    }
  };

  updateCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.updateCategory(id, req.body);
      res.json({ status: true, message: 'Category updated', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error updating category', error });
    }
  };

  deleteCategory = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.service.deleteCategory(id);
      res.json({ status: true, message: 'Category deleted', data: null });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error deleting category', error });
    }
  };

  // --- Folders ---

  getAllFolders = async (req: Request, res: Response): Promise<void> => {
    try {
      const { category_id } = req.query; // Support filter
      const data = await this.service.getAllFolders(category_id as string);
      res.json({ status: true, message: 'Folders retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error', error });
    }
  };

  // Note: getFolderDetail serves as the primary "Get Folder" endpoint including children.
  // If raw folder access is needed, we could add getFolderRaw, but detail is usually preferred.
  // For consistency with CRUD, I'll name the method used for "Detail" as getFolderDetail above,
  // but if the user GET /api/links/folders/:id, it will map to that.

  getFolder = async (req: Request, res: Response): Promise<void> => {
      // Logic for raw folder? No, redirect to detail or use detail service.
      // service.getFolder returns RAW folder. service.getFolderDetail returns aggregated.
      // If the user wants to populate an "Edit Folder" form, they need raw data.
      // But aggregated data contains the raw data in `data.folder`.
      // So reusing getFolderDetail is efficient.
      return this.getFolderDetail(req, res);
  };

  createFolder = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.createFolder(req.body);
      res.status(201).json({ status: true, message: 'Folder created', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error creating folder', error });
    }
  };

  updateFolder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.updateFolder(id, req.body);
      res.json({ status: true, message: 'Folder updated', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error updating folder', error });
    }
  };

  deleteFolder = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.service.deleteFolder(id);
      res.json({ status: true, message: 'Folder deleted', data: null });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error deleting folder', error });
    }
  };

  // --- Subheadings ---

  getAllSubheadings = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getAllSubheadings();
      res.json({ status: true, message: 'Subheadings retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error', error });
    }
  };

  getSubheading = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.getSubheading(id);
      if (!data) {
        res.status(404).json({ status: false, message: 'Subheading not found' });
        return;
      }
      res.json({ status: true, message: 'Subheading retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error', error });
    }
  };

  createSubheading = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.createSubheading(req.body);
      res.status(201).json({ status: true, message: 'Subheading created', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error creating subheading', error });
    }
  };

  updateSubheading = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.updateSubheading(id, req.body);
      res.json({ status: true, message: 'Subheading updated', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error updating subheading', error });
    }
  };

  deleteSubheading = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.service.deleteSubheading(id);
      res.json({ status: true, message: 'Subheading deleted', data: null });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error deleting subheading', error });
    }
  };

  // --- Links (Items) ---

  getAllLinks = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getAllLinks();
      res.json({ status: true, message: 'Links retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error', error });
    }
  };

  getLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.getLink(id);
      if (!data) {
        res.status(404).json({ status: false, message: 'Link not found' });
        return;
      }
      res.json({ status: true, message: 'Link retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error', error });
    }
  };

  createLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.createLink(req.body);
      res.status(201).json({ status: true, message: 'Link created', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error creating link', error });
    }
  };

  updateLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.updateLink(id, req.body);
      res.json({ status: true, message: 'Link updated', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error updating link', error });
    }
  };

  deleteLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.service.deleteLink(id);
      res.json({ status: true, message: 'Link deleted', data: null });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error deleting link', error });
    }
  };
}
