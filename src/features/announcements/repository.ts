import { StaffAnnouncement } from '@prisma/client';
import prisma from '../../utils/db.js';

export class AnnouncementsRepository {
  async findByNrp(nrp: string): Promise<StaffAnnouncement | null> {
    return prisma.staffAnnouncement.findUnique({
      where: {
        nrp,
      },
    });
  }

  async markAsViewed(id: string): Promise<void> {
    await prisma.staffAnnouncement.update({
      where: { id },
      data: { viewedAt: new Date() },
    });
  }
}
