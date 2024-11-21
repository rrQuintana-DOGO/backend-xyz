import { PrismaClient } from '@prisma/client';
import { eventSeeder } from '@seeders/eventsSeeder';
import { connectDB, disconnectDB } from '@app/mongoose/mongoose.module';
import { Logger } from '@nestjs/common';
import { log } from 'console';

const postgresql = new PrismaClient();
const logger = new Logger('SeedScript');

connectDB();

async function truncateTables() {
  try {
    await postgresql.$transaction(async (postgresql) => {
      await postgresql.$executeRaw`SET session_replication_role = 'replica';`;
      await postgresql.$executeRaw`TRUNCATE TABLE events RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`SET session_replication_role = 'origin';`;
    });
  } catch (error) {
    // Agregar tratamiento de error
  } finally {
    await postgresql.$disconnect();
  }
}

async function main() {
  try {
    await truncateTables();

    const events = await eventSeeder();
    logger.log(events);

  } catch (e) {
    // Agregar tratamiento de error
  } finally {
    await postgresql.$disconnect();
    disconnectDB();
  }
}

main();
