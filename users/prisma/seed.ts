import { PrismaClient } from '@prisma/client';
import { 
  credentialSeeder,
  timeZoneSeeders,
  userSeeder
} from '@seeders/index';
import { Logger } from '@nestjs/common';

const postgresql = new PrismaClient();
const logger = new Logger('SeedScript');


async function truncateTables() {
  try {
    await postgresql.$transaction(async (postgresql) => {
      await postgresql.$executeRaw`SET session_replication_role = 'replica';`;
      await postgresql.$executeRaw`TRUNCATE TABLE credentials RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE time_zones RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE users RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`SET session_replication_role = 'origin';`;
    });
    logger.log('Tablas y colecciones truncadas exitosamente');
  } catch (error) {
    logger.error('Error truncando las tablas:', error);
  } finally {
    await postgresql.$disconnect();
  }
}

async function main() {
  try {
    await truncateTables();

    const credentials = await credentialSeeder(5);
    const timeZones = await timeZoneSeeders(5);
    const users = await userSeeder(5);

    logger.log(credentials);
    logger.log(timeZones);
    logger.log(users);

    logger.log('\nSeed completed.');
  } catch (e) {
    logger.error('Error seeding data:', e);
  } finally {
    await postgresql.$disconnect();
  }
}

main();
