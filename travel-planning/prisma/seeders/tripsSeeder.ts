import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const tripsSeeder = async (count: number) => {
  try {
    const trip_types = await prisma.trip_types.findMany();
    const journey_types = await prisma.journey_types.findMany();
    const carriers = await prisma.carriers.findMany();
    const routes = await prisma.routes.findMany();
    const clients = await prisma.clients.findMany();
    const phases = await prisma.phases.findMany();
    const status = await prisma.status.findMany();
    const places = await prisma.places.findMany();

    // Validar que hay datos disponibles
    if (!trip_types.length) throw new Error('No trip types available');
    if (!journey_types.length) throw new Error('No journey types available');
    if (!carriers.length) throw new Error('No carriers available');
    if (!phases.length) throw new Error('No phases available');
    if (!status.length) throw new Error('No status available');
    if (!places.length) throw new Error('No places available'); // Validación de lugares

    // Crear un array con la cantidad deseada de objetos de viaje
    const trips = Array.from({ length: count }, () => ({
      id_trip: uuidv4(),
      id_ext: uuidv4(),
      id_trip_type: trip_types[Math.floor(Math.random() * trip_types.length)].id_trip_type,
      id_journey_type: journey_types[Math.floor(Math.random() * journey_types.length)].id_journey_type,
      id_carrier: carriers[Math.floor(Math.random() * carriers.length)].id_carrier,
      eta: Math.floor(Date.now() / 1000),
      id_route: Math.random() < 0.8 ? routes[Math.floor(Math.random() * routes.length)].id_route : null,
      id_client: Math.random() < 0.8 ? clients[Math.floor(Math.random() * clients.length)].id_client : null,
      action: faker.number.int({ min: 1, max: 2 }),
      eda: faker.number.int({ min: 0, max: 100 }),
      id_phase: phases[Math.floor(Math.random() * phases.length)].id_phase,
      id_status: status[Math.floor(Math.random() * status.length)].id_status,
      kilometers: faker.number.int({ min: 0, max: 10000 }),
      description: faker.lorem.words(10),
      load_size: faker.number.float({ min: 0, max: 100 }),
      fuel_level_start: faker.number.float({ min: 0, max: 100 }),
      fuel_level_end: faker.number.float({ min: 0, max: 100 }),
      created_at: Math.floor(Date.now() / 1000),
    }));

    // Insertar todos los objetos de viaje en la base de datos
    await prisma.trips.createMany({
      data: trips,
    });

    // Consultar los IDs de los viajes recién creados
    const createdTrips = await prisma.trips.findMany({
      where: {
        id_trip: { in: trips.map(c => c.id_trip) },
      },
    });

    const placesNames = [
      'Paseo del country',,
      'Puente internacional',
      'Encinal',
      'San Antonio',
    ];

    const placesSort = places.sort((a, b) => {
      return placesNames.indexOf(a.name) - placesNames.indexOf(b.name);
    });

    // Crear los registros de trips_has_places
    const tripPlaceRelations = createdTrips.flatMap(trip => {
      const numberOfPlaces = placesNames.length;
      let currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos

      return Array.from({ length: numberOfPlaces }, (_, i) => {
        const estimate_arrive_date = currentTime + faker.number.int({ min: 3600, max: 86400 }); // Estimación de llegada entre 1 y 24 horas
        const real_arrive_date = Math.random() < 0.5 ? estimate_arrive_date : null; // Real si se ha llegado
        const estimate_departure_date = estimate_arrive_date + faker.number.int({ min: 3600, max: 86400 }); // Estimación de salida entre 1 y 24 horas después de la llegada
        const real_estimate_departure_date = Math.random() < 0.5 ? estimate_departure_date : null; // Real si se ha salido

        // Actualizar currentTime para el próximo lugar
        currentTime = estimate_departure_date;

        return {
          id_trip: trip.id_trip,
          id_place: placesSort[i % placesSort.length].id_place, // Asignar lugares en orden
          estimate_arrive_date,
          real_arrive_date,
          estimate_departure_date,
          real_estimate_departure_date,
          phase: Number(phases[Math.floor(Math.random() * phases.length)].id_phase), // Asignar una fase aleatoria
        };
      });
    });

    // Insertar los registros en trips_has_places
    if (tripPlaceRelations.length > 0) {
      await prisma.trips_has_places.createMany({
        data: tripPlaceRelations,
      });
    }

    return `Se crearon ${createdTrips.length} registros de viajes y ${tripPlaceRelations.length} relaciones de viajes con lugares`;
  }
  catch (error) {
    console.error('Error seeding trips:', error);
    return [];
  }
  finally {
    await prisma.$disconnect();
  }
};
