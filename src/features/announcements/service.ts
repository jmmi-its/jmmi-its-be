import { AnnouncementsRepository } from './repository.js';

interface CheckResult {
  status: 'passed' | 'failed';
  name?: string;
  codename?: string;
  message?: string;
}

export class AnnouncementsService {
  private repository: AnnouncementsRepository;

  constructor() {
    this.repository = new AnnouncementsRepository();
  }

  async checkStatus(nrp: string): Promise<CheckResult> {
    const announcement = await this.repository.findByNrp(nrp);

    if (!announcement) {
      return {
        status: 'failed',
        name: 'Peserta Seleksi Staff Muda JMMI ITS 2026',
      };
    }

    // Optional: Check if already viewed
    // if (announcement.viewedAt) {
    //   return { status: 'failed', message: 'Result already viewed' }; // Or handle as needed
    // }

    // Optional: Mark as viewed
    // await this.repository.markAsViewed(announcement.id);

    return {
      status: 'passed',
      name: announcement.name,
      codename: announcement.codename,
    };
  }
}
