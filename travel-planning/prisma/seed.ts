import { PrismaClient } from '@prisma/client';
import { 
  carrierSeeder,
  journeyTypesSeeder,
  phasesSeeder,
  routeSeeder,
  statusSeeder,
  contactSeeder,
  stopsTypesSeeder,
  stopsSeeder,
  placeTypeSeeder,
  placesSeeder,
  licenseTypeSeeder,
  driverSeeder,
  tripTypesSeeder,
  clientSeeder,
  situationsSeeder,
  tripsSeeder,
  geoRoutesSeeder
} from '@seeders/index';

import { Logger } from '@nestjs/common';

const postgresql = new PrismaClient();
const logger = new Logger('SeedScript');


async function truncateTables() {
  try {
    // Iniciar la transacción para PostgreSQL
    await postgresql.$transaction(async (postgresql) => {
      // Desactivar las restricciones de claves foráneas
      await postgresql.$executeRaw`SET session_replication_role = 'replica';`;

      // Truncar las tablas en PostgreSQL
      await postgresql.$executeRaw`TRUNCATE TABLE carriers RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE georoutes RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE trip_types RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE journey_types RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE routes RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE phases RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE status RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE geofences RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE stop_types RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE contacts RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE stops RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE place_types RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE places RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE license_types RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE drivers RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE trips RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE trip_types RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE clients RESTART IDENTITY CASCADE`;
      await postgresql.$executeRaw`TRUNCATE TABLE situations RESTART IDENTITY CASCADE`;

      // Agregar más tablas según sea necesario

      // Reactivar las restricciones de claves foráneas
      await postgresql.$executeRaw`SET session_replication_role = 'origin';`;
    });

    logger.log('Tablas y colecciones truncadas exitosamente');
  } catch (error) {
    logger.error('Error truncando las tablas:', error);
  } finally {
    // Cerrar conexiones
    await postgresql.$disconnect();
  }
}

async function main() {
  try {
    // Esperar a que las tablas se trunquen
    await truncateTables();

    // Ejecutar los seeders para carriers, maintenance_types y suppliers
    const carriers = await carrierSeeder();
    const journey_types = await journeyTypesSeeder();
    const georoutes = await geoRoutesSeeder();
    const routes = await routeSeeder();
    const phases = await phasesSeeder();
    const status = await statusSeeder();
    const stop_types = await stopsTypesSeeder(5);
    const contacts = await contactSeeder(50);
    const place_types = await placeTypeSeeder(5);
    const places = await placesSeeder();
    const stops = await stopsSeeder(100);
    const license_types = await licenseTypeSeeder(50);
    const drivers = await driverSeeder();
    const trip_types = await tripTypesSeeder();
    const clients = await clientSeeder();
    const situations = await situationsSeeder();
    const trips = await tripsSeeder(100);

    logger.log(carriers);
    logger.log(journey_types);
    logger.log(routes);
    logger.log(phases);
    logger.log(status);
    logger.log(stop_types);
    logger.log(contacts);
    logger.log(stops);
    logger.log(place_types);
    logger.log(places);
    logger.log(license_types);
    logger.log(drivers);
    logger.log(trip_types);
    logger.log(clients);
    logger.log(situations);
    logger.log(trips);
    
    logger.log('\nSeed completed.');
  } catch (e) {
    logger.error('Error seeding data:', e);
  } finally {
    await postgresql.$disconnect();
  }
}

main();