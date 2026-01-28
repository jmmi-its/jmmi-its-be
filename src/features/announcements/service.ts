import prisma from '../../utils/db.js';

interface CheckResult {
  status: 'passed' | 'failed';
  name?: string;
  codename?: string;
  message?: string;
}

// Define interface locally since generated types might be missing locally
interface StaffAnnouncementModel {
  id: string;
  nrp: string;
  name: string;
  codename: string;
  createdAt: Date;
  viewedAt: Date | null;
}

export class AnnouncementsService {
  async checkStatus(nrp: string): Promise<CheckResult> {
    // Access prisma directly like in LinksService
    // Casting to unknown first to avoid TS errors if types are not generated locally
    const announcement = (await prisma.staffAnnouncement.findUnique({
      where: {
        nrp,
      },
    })) as unknown as StaffAnnouncementModel | null;

    if (!announcement) {
      return {
        status: 'failed',
        name: 'Peserta Seleksi Staff Muda JMMI ITS 2026',
      };
    }

    return {
      status: 'passed',
      name: announcement.name,
      codename: announcement.codename,
    };
  }
}
