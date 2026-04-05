import { Request, Response } from 'express';
import { AuthService } from './service.js';

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({
          status: false,
          message: 'Email and password are required',
        });
        return;
      }

      const result = await this.service.login(email, password);

      if (!result) {
        res.status(401).json({
          status: false,
          message: 'Invalid email or password',
        });
        return;
      }

      res.status(200).json({
        status: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      console.error('Error in AuthController.login:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
        error: String(error),
      });
    }
  };

  verify = async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          status: false,
          message: 'Token required',
        });
        return;
      }

      const admin = await this.service.verifyToken(token);

      if (!admin) {
        res.status(401).json({
          status: false,
          message: 'Invalid token',
        });
        return;
      }

      res.status(200).json({
        status: true,
        message: 'Token valid',
        data: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      });
    } catch (error) {
      console.error('Error in AuthController.verify:', error);
      res.status(500).json({
        status: false,
        message: 'Internal server error',
      });
    }
  };
}
