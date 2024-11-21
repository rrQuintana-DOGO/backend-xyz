import { PrismaClient } from '@prisma/client';
import { 
  configGroupsSeeder,
  fuelTypeSeeder,
  groupSeeder,
  maintenanceTypesSeeder,
  suppliersSeeder,
  unitTypeSeeder,
  unitSeeder,
  unitMeasurementSeeder,
  setpointsSeeder
} from '@seeders/index';
import { connectDB, disconnectDB } from '@app/mongoose/mongoose.module';
import { Logger } from '@nestjs/common';

const postgresql = new PrismaClient();
const logger = new Logger('SeedScript');

connectDB();

async function truncateTables() {
  try {
    await postgresql.$transaction(async (postgresql) => {
      await postgresql.$executeRaw`SET session_replication_role = 'replica';`;
      await postgresql.$executeRaw`TRUNCATE TABLE config_groups RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE groups RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE fuel_types RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE suppliers RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE unit_types RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE units RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE unit_measurements RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE setpoints RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE maintenance_types RESTART IDENTITY CASCADE`;
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
    
    const maintenanceTypes = await maintenanceTypesSeeder(5);
    const suppliers = await suppliersSeeder(5);
    const unitMeasurements = await unitMeasurementSeeder(5);
    const fuelTypes = await fuelTypeSeeder(5);
    const unitTypes = await unitTypeSeeder(5);
    const units = await unitSeeder();
    const configGroups = await configGroupsSeeder(5);
    const groups = await groupSeeder(5);
    const setpoints = await setpointsSeeder();


    logger.log('Created configGroups: ', configGroups);
    logger.log('Created groups: ', groups);
    logger.log('Created maintenanceTypes: ', maintenanceTypes);
    logger.log('Created suppliers: ', suppliers);
    logger.log('Created unitTypes: ', unitTypes);
    logger.log('Created units: ', units);
    logger.log('Created unitMeasurements: ', unitMeasurements);
    logger.log('Created fuelTypes: ', fuelTypes);
    logger.log('Created setpoints: ', setpoints);


    logger.log('\nSeed completed.');
  } catch (e) {
    logger.error('Error seeding data:', e);
  } finally {
    await postgresql.$disconnect();
    disconnectDB();
  }
}

main();
