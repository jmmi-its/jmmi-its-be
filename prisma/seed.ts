import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const staffAnnouncements = [
    {
      nrp: '500000001',
      name: 'Abdullah Azzam',
      codename: 'JMMI-2026-X7Y',
    },
    {
      nrp: '500000002',
      name: 'Budi Santoso',
      codename: 'JMMI-2026-A1B',
    },
    {
      nrp: '500000003',
      name: 'Siti Aminah',
      codename: 'JMMI-2026-C3D',
    },
  ];

  for (const announcement of staffAnnouncements) {
    const user = await prisma.staffAnnouncement.upsert({
      where: { nrp: announcement.nrp },
      update: {},
      create: announcement,
    });
    console.log(`Created staff announcement for: ${user.name}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
