import { Router } from 'express';
import { FinanceController } from './controller.js';
import { requireAuth } from '../../middleware/auth.js';

const financeRouter = Router();
const controller = new FinanceController();

financeRouter.get('/report', controller.getReport);

// Admin only routes - require authentication
financeRouter.get('/admin/transactions', requireAuth, controller.getAllTransactions);
financeRouter.post('/admin/transactions', requireAuth, controller.createTransaction);
financeRouter.put('/admin/transactions/:id', requireAuth, controller.updateTransaction);
financeRouter.delete('/admin/transactions/:id', requireAuth, controller.deleteTransaction);

export { financeRouter };
