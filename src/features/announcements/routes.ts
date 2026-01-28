import { Router } from 'express';
import { AnnouncementsController } from './controller.js';

const router = Router();
const controller = new AnnouncementsController();

// Rate limiting could be added here as middleware if needed
// import rateLimit from 'express-rate-limit';
// const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 5 });

router.post('/check', controller.check);

export const announcementRouter = router;
