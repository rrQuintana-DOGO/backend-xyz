import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const routeSeeder = async () => {
  try {
    const routeNames = [
      'Ruta del Sol',
      'Camino de los Andes',
      'Sendero del Bosque',
      'Ruta del Mar',
      'Camino del Desierto',
      'Ruta de la Montaña',
      'Sendero del Río',
      'Camino de la Selva',
      'Ruta del Viento',
      'Sendero de la Luna'
    ];

    // Crear un array con la cantidad deseada de objetos
    const objects = routeNames.map(name => ({
      id_route: uuidv4(),
      name: name,
      description: faker.lorem.words(3),
      version: faker.number.int({ min: 0, max: 10 }),
      status: true,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.routes.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.routes.findMany({
      where: {
        id_route: { in: objects.map(c => c.id_route) },
      },
    });

    const waypoints = await prisma.waypoints.findMany({
      orderBy: {
        order: 'asc'
      }
    });

    createdRecords.forEach(async (record, index) => {
      waypoints.forEach(async (waypoint, index) => {
        await prisma.route_has_waypoints.create({
          data: {
            id_route_has_waypoint: uuidv4(),
            id_route: record.id_route,
            id_waypoint: waypoint.id_waypoint,
            version: 1
          },
        });
      });
    });


    return `Se crearon ${createdRecords.length} registros exitosamente`;
  }
  catch (error) {
    console.error('Error seeding routes:', error);
    return [];
  }
  finally {
    await prisma.$disconnect();
  }
};