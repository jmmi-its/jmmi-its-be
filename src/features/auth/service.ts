import jwt from 'jsonwebtoken';
import config from '../../config/env.js';
import prisma from '../../utils/db.js';
import { AdminModel, LoginResponse } from './types.js';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

export class AuthService {
  async login(email: string, password: string): Promise<LoginResponse | null> {
    let admin = (await prisma.admin.findUnique({
      where: { email },
    })) as unknown as AdminModel | null;

    // Existing admin:
    // Accept either stored password or ADMIN_PASSWORD (useful when env password rotates).
    if (admin) {
      const isValidPassword =
        password === admin.password || password === ADMIN_PASSWORD;

      if (!isValidPassword) {
        return null;
      }
    } else {
      // First-time admin creation must use ADMIN_PASSWORD.
      if (password !== ADMIN_PASSWORD) {
        return null;
      }

      admin = (await prisma.admin.create({
        data: {
          email,
          name: email.split('@')[0],
          password: ADMIN_PASSWORD,
        },
      })) as unknown as AdminModel;
    }

    const access_token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        type: 'access',
      },
      config.jwtSecret,
      { expiresIn: config.jwtAccessExpiresIn as jwt.SignOptions['expiresIn'] }
    );
    const refresh_token = jwt.sign(
      {
        adminId: admin.id,
        email: admin.email,
        type: 'refresh',
      },
      config.jwtSecret,
      { expiresIn: config.jwtRefreshExpiresIn as jwt.SignOptions['expiresIn'] }
    );

    return {
      id: admin.id,
      email: admin.email,
      name: admin.name,
      access_token,
      refresh_token,
    };
  }

  async verifyToken(token: string): Promise<AdminModel | null> {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as {
        adminId?: string;
        type?: string;
      };

      if (!decoded.adminId || decoded.type !== 'access') {
        return null;
      }

      const admin = (await prisma.admin.findUnique({
        where: { id: decoded.adminId },
      })) as unknown as AdminModel | null;

      return admin;
    } catch {
      return null;
    }
  }
}
