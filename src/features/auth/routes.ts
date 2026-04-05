import { Router } from 'express';
import { AuthController } from './controller.js';

const authRouter = Router();
const controller = new AuthController();

authRouter.post('/login', controller.login);
authRouter.post('/verify', controller.verify);

export { authRouter };
