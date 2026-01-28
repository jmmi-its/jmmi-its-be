import { Request, Response } from 'express';
import { AnnouncementsService } from './service.js';

export class AnnouncementsController {
  private service: AnnouncementsService;

  constructor() {
    this.service = new AnnouncementsService();
  }

  check = async (req: Request, res: Response): Promise<void> => {
    try {
      const { nrp } = req.body;

      if (!nrp) {
        res.status(400).json({
          status: 'error',
          message: 'NRP is required',
        });
        return;
      }

      // Basic validation: ensure NRP contains only digits (and reasonable length)
      // JMMI requirement: "Pastikan input nrp hanya berisi angka dan panjang karakter yang wajar"
      if (!/^\d+$/.test(nrp) || nrp.length > 20) {
         res.status(400).json({
          status: 'error',
          message: 'Invalid NRP format',
        });
        return;
      }

      const result = await this.service.checkStatus(nrp);

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      console.error('Error in AnnouncementsController.check:', error);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error',
      });
    }
  };
}
