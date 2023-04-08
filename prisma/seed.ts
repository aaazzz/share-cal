import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const akira = await prisma.user.upsert({
    where: { id: 'akira001' },
    update: {},
    create: {
      id: 'akira001',
      name: 'akira',
      email: 'akira@sango-tech.com',
      accessToken: 'xxxxxxxxxxxxxxxxxx',
      refreshToken: 'yyyyyyyyyyyyyyyyyy',
    },
  });

  const sangoCal = await prisma.calendar.upsert({
    where: { id: 1 },
    update: {},
    create: {
      calendarId: 'akira@sango-tech.com',
      isHideDetail: true,
      userId: akira.id,
    },
  });
  console.log({ akira, sangoCal });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
