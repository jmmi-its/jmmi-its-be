import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../features/auth/service.js';

const authService = new AuthService();

export interface AuthRequest extends Request {
  adminId?: string;
  email?: string;
}

export async function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        status: false,
        message: 'Authorization token required',
      });
      return;
    }

    const admin = await authService.verifyToken(token);

    if (!admin) {
      res.status(401).json({
        status: false,
        message: 'Invalid or expired token',
      });
      return;
    }

    req.adminId = admin.id;
    req.email = admin.email;
    next();
  } catch (error) {
    res.status(401).json({
      status: false,
      message: 'Unauthorized',
      error: String(error),
    });
  }
}
