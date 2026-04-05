import { Request, Response } from 'express';
import { FinanceService } from './service.js';

export class FinanceController {
  private service: FinanceService;

  constructor() {
    this.service = new FinanceService();
  }

  getReport = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getReport();
      res.json({ status: true, message: 'Finance report retrieved', data });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error fetching finance report',
        error,
      });
    }
  };

  getAllTransactions = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getAllTransactions();
      res.json({
        status: true,
        message: 'All transactions retrieved',
        data,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error fetching transactions',
        error,
      });
    }
  };

  createTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const { type, description, amount, transaction_at } = req.body;

      if (!type || !description || !amount || !transaction_at) {
        res.status(400).json({
          status: false,
          message:
            'Missing required fields: type, description, amount, transaction_at',
        });
        return;
      }

      const data = await this.service.createTransaction(
        type,
        description,
        amount,
        new Date(transaction_at)
      );

      res.status(201).json({
        status: true,
        message: 'Transaction created successfully',
        data,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error creating transaction',
        error,
      });
    }
  };

  updateTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const { type, description, amount, transaction_at } = req.body;

      const data = await this.service.updateTransaction(
        id,
        type,
        description,
        amount,
        transaction_at ? new Date(transaction_at) : undefined
      );

      if (!data) {
        res.status(404).json({
          status: false,
          message: 'Transaction not found',
        });
        return;
      }

      res.json({
        status: true,
        message: 'Transaction updated successfully',
        data,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error updating transaction',
        error,
      });
    }
  };

  deleteTransaction = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };

      const success = await this.service.deleteTransaction(id);

      if (!success) {
        res.status(404).json({
          status: false,
          message: 'Transaction not found',
        });
        return;
      }

      res.json({
        status: true,
        message: 'Transaction deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error deleting transaction',
        error,
      });
    }
  };
}
