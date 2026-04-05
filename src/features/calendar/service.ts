import prisma from '../../utils/db.js';
import {
  CalendarEvent,
  CalendarEventModel,
  CalendarRecurrenceType,
  CreateCalendarEventPayload,
  UpdateCalendarEventPayload,
} from './types.js';

interface CalendarEventDelegate {
  findMany: (args: {
    orderBy: Array<Record<string, 'asc' | 'desc'>>;
  }) => Promise<unknown>;
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  findUnique: (args: { where: { id: string } }) => Promise<unknown>;
  update: (args: {
    where: { id: string };
    data: Record<string, unknown>;
  }) => Promise<unknown>;
  delete: (args: { where: { id: string } }) => Promise<unknown>;
}

interface PrismaCalendarClient {
  calendarEvent: CalendarEventDelegate;
}

export class CalendarService {
  private calendarEvent = (prisma as unknown as PrismaCalendarClient).calendarEvent;

  private toCalendarEventDTO(item: CalendarEventModel): CalendarEvent {
    return {
      event_id: item.id,
      event_name: item.eventName,
      event_date: item.eventDate.toISOString(),
      event_time: item.eventTime,
      location: item.location,
      is_recurring: item.isRecurring,
      recurrence_type: item.recurrenceType,
      recurrence_interval: item.recurrenceInterval,
      notes: item.notes,
      timestamp: item.createdAt.toISOString(),
      updated_at: item.updatedAt.toISOString(),
    };
  }

  async getPublicEvents(): Promise<CalendarEvent[]> {
    const records = (await this.calendarEvent.findMany({
      orderBy: [{ eventDate: 'asc' }, { eventTime: 'asc' }, { createdAt: 'desc' }],
    })) as unknown as CalendarEventModel[];

    return records.map((item) => this.toCalendarEventDTO(item));
  }

  async getAllEvents(): Promise<CalendarEvent[]> {
    const records = (await this.calendarEvent.findMany({
      orderBy: [{ eventDate: 'asc' }, { eventTime: 'asc' }, { createdAt: 'desc' }],
    })) as unknown as CalendarEventModel[];

    return records.map((item) => this.toCalendarEventDTO(item));
  }

  async createEvent(payload: CreateCalendarEventPayload): Promise<CalendarEvent> {
    const isRecurring = payload.is_recurring ?? false;
    const recurrenceInterval = payload.recurrence_interval && payload.recurrence_interval > 0
      ? payload.recurrence_interval
      : 1;

    const record = (await this.calendarEvent.create({
      data: {
        eventName: payload.event_name,
        eventDate: new Date(payload.event_date),
        eventTime: payload.event_time,
        location: payload.location,
        isRecurring,
        recurrenceType: isRecurring
          ? ((payload.recurrence_type ?? null) as CalendarRecurrenceType | null)
          : null,
        recurrenceInterval: isRecurring ? recurrenceInterval : 1,
        notes: payload.notes?.trim() ? payload.notes.trim() : null,
      },
    })) as unknown as CalendarEventModel;

    return this.toCalendarEventDTO(record);
  }

  async updateEvent(id: string, payload: UpdateCalendarEventPayload): Promise<CalendarEvent | null> {
    const existing = await this.calendarEvent.findUnique({ where: { id } });

    if (!existing) {
      return null;
    }

    const data: Record<string, unknown> = {};

    if (payload.event_name !== undefined) data.eventName = payload.event_name;
    if (payload.event_date !== undefined) data.eventDate = new Date(payload.event_date);
    if (payload.event_time !== undefined) data.eventTime = payload.event_time;
    if (payload.location !== undefined) data.location = payload.location;
    if (payload.is_recurring !== undefined) data.isRecurring = payload.is_recurring;
    if (payload.recurrence_type !== undefined) {
      data.recurrenceType = payload.recurrence_type;
    }
    if (payload.recurrence_interval !== undefined) {
      data.recurrenceInterval = payload.recurrence_interval > 0 ? payload.recurrence_interval : 1;
    }
    if (payload.notes !== undefined) {
      data.notes = payload.notes?.trim() ? payload.notes.trim() : null;
    }

    const nextIsRecurring =
      payload.is_recurring !== undefined
        ? payload.is_recurring
        : ((existing as CalendarEventModel).isRecurring ?? false);

    if (!nextIsRecurring) {
      data.recurrenceType = null;
      data.recurrenceInterval = 1;
    } else if (data.recurrenceInterval === undefined) {
      data.recurrenceInterval = (existing as CalendarEventModel).recurrenceInterval || 1;
    }

    const record = (await this.calendarEvent.update({
      where: { id },
      data,
    })) as unknown as CalendarEventModel;

    return this.toCalendarEventDTO(record);
  }

  async deleteEvent(id: string): Promise<boolean> {
    const existing = await this.calendarEvent.findUnique({ where: { id } });

    if (!existing) {
      return false;
    }

    await this.calendarEvent.delete({ where: { id } });
    return true;
  }
}
