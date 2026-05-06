import { Request, Response } from 'express';
import { ShortLinksService } from './service.js';

export class ShortLinksController {
  private service: ShortLinksService;

  constructor() {
    this.service = new ShortLinksService();
  }

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getAll();
      res.json({ status: true, message: 'Short links retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error fetching short links', error });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.getById(id);
      if (!data) {
        res.status(404).json({ status: false, message: 'Short link not found' });
        return;
      }
      res.json({ status: true, message: 'Short link retrieved', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error fetching short link', error });
    }
  };

  redirectShortLink = async (req: Request, res: Response): Promise<void> => {
    try {
      const { shortCode } = req.params as { shortCode: string };
      const data = await this.service.redirectShortLink(shortCode);
      if (!data) {
        res.status(404).json({ status: false, message: 'Short link not found' });
        return;
      }

      res.redirect(302, data.url);
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error redirecting short link', error });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.create(req.body);
      res.status(201).json({ status: true, message: 'Short link created', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error creating short link', error });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const data = await this.service.update(id, req.body);
      res.json({ status: true, message: 'Short link updated', data });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error updating short link', error });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      await this.service.delete(id);
      res.json({ status: true, message: 'Short link deleted', data: null });
    } catch (error) {
      res.status(500).json({ status: false, message: 'Error deleting short link', error });
    }
  };
}
