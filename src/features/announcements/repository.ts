import { PrismaClient, StaffAnnouncement } from '@prisma/client';

const prisma = new PrismaClient();

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
