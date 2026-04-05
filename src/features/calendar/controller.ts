import { Request, Response } from 'express';
import { CalendarService } from './service.js';
import {
  CalendarRecurrenceType,
  CreateCalendarEventPayload,
  UpdateCalendarEventPayload,
} from './types.js';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;
const RECURRENCE_TYPES: CalendarRecurrenceType[] = ['weekly', 'monthly', 'custom_period'];

function isValidDate(value: string): boolean {
  const date = new Date(value);
  return !Number.isNaN(date.getTime());
}

function isValidPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0;
}

export class CalendarController {
  private service: CalendarService;

  constructor() {
    this.service = new CalendarService();
  }

  getPublicEvents = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getPublicEvents();
      res.json({ status: true, message: 'Calendar events retrieved', data });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error fetching calendar events',
        error,
      });
    }
  };

  getAllEvents = async (_req: Request, res: Response): Promise<void> => {
    try {
      const data = await this.service.getAllEvents();
      res.json({ status: true, message: 'All calendar events retrieved', data });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error fetching all calendar events',
        error,
      });
    }
  };

  createEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const payload = req.body as CreateCalendarEventPayload;

      if (!payload.event_name || !payload.event_date || !payload.event_time || !payload.location) {
        res.status(400).json({
          status: false,
          message: 'Missing required fields: event_name, event_date, event_time, location',
        });
        return;
      }

      if (!isValidDate(payload.event_date)) {
        res.status(400).json({
          status: false,
          message: 'Invalid event_date format',
        });
        return;
      }

      if (!TIME_PATTERN.test(payload.event_time)) {
        res.status(400).json({
          status: false,
          message: 'Invalid event_time format. Use HH:mm',
        });
        return;
      }

      if (
        payload.is_recurring &&
        (!payload.recurrence_type || !RECURRENCE_TYPES.includes(payload.recurrence_type))
      ) {
        res.status(400).json({
          status: false,
          message:
            'Invalid recurrence_type. Use one of: weekly, monthly, custom_period',
        });
        return;
      }

      if (
        payload.is_recurring &&
        payload.recurrence_interval !== undefined &&
        !isValidPositiveInteger(payload.recurrence_interval)
      ) {
        res.status(400).json({
          status: false,
          message: 'recurrence_interval must be a positive integer',
        });
        return;
      }

      const data = await this.service.createEvent({
        ...payload,
        event_name: payload.event_name.trim(),
        location: payload.location.trim(),
        recurrence_type: payload.is_recurring ? payload.recurrence_type : null,
      });

      res.status(201).json({
        status: true,
        message: 'Calendar event created successfully',
        data,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error creating calendar event',
        error,
      });
    }
  };

  updateEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const payload = req.body as UpdateCalendarEventPayload;

      if (payload.event_date !== undefined && !isValidDate(payload.event_date)) {
        res.status(400).json({
          status: false,
          message: 'Invalid event_date format',
        });
        return;
      }

      if (payload.event_time !== undefined && !TIME_PATTERN.test(payload.event_time)) {
        res.status(400).json({
          status: false,
          message: 'Invalid event_time format. Use HH:mm',
        });
        return;
      }

      if (
        payload.recurrence_type !== undefined &&
        payload.recurrence_type !== null &&
        !RECURRENCE_TYPES.includes(payload.recurrence_type)
      ) {
        res.status(400).json({
          status: false,
          message:
            'Invalid recurrence_type. Use one of: weekly, monthly, custom_period',
        });
        return;
      }

      if (payload.is_recurring === true && !payload.recurrence_type) {
        res.status(400).json({
          status: false,
          message: 'recurrence_type is required when is_recurring is true',
        });
        return;
      }

      if (
        payload.recurrence_interval !== undefined &&
        !isValidPositiveInteger(payload.recurrence_interval)
      ) {
        res.status(400).json({
          status: false,
          message: 'recurrence_interval must be a positive integer',
        });
        return;
      }

      const data = await this.service.updateEvent(id, {
        ...payload,
        event_name:
          payload.event_name !== undefined ? payload.event_name.trim() : payload.event_name,
        location: payload.location !== undefined ? payload.location.trim() : payload.location,
      });

      if (!data) {
        res.status(404).json({
          status: false,
          message: 'Calendar event not found',
        });
        return;
      }

      res.json({
        status: true,
        message: 'Calendar event updated successfully',
        data,
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error updating calendar event',
        error,
      });
    }
  };

  deleteEvent = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params as { id: string };
      const success = await this.service.deleteEvent(id);

      if (!success) {
        res.status(404).json({
          status: false,
          message: 'Calendar event not found',
        });
        return;
      }

      res.json({
        status: true,
        message: 'Calendar event deleted successfully',
      });
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'Error deleting calendar event',
        error,
      });
    }
  };
}
