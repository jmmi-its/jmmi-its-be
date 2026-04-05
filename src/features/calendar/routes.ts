import { Router } from 'express';
import { CalendarController } from './controller.js';
import { requireAuth } from '../../middleware/auth.js';

const calendarRouter = Router();
const controller = new CalendarController();

// Public routes
calendarRouter.get('/events', controller.getPublicEvents);

// Admin only routes
calendarRouter.get('/admin/events', requireAuth, controller.getAllEvents);
calendarRouter.post('/admin/events', requireAuth, controller.createEvent);
calendarRouter.put('/admin/events/:id', requireAuth, controller.updateEvent);
calendarRouter.delete('/admin/events/:id', requireAuth, controller.deleteEvent);

export { calendarRouter };
