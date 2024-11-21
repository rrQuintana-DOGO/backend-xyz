import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { ad } from '@faker-js/faker/dist/airline-C5Qwd7_q';

const prisma = new PrismaClient();

export const stopsSeeder = async (count: number) => {
  try {
    const geofences = await prisma.geofences.findMany();

    // Crear un array con la cantidad deseada de objetos
    const objects = Array.from({ length: count }, () => ({
      id_stop: uuidv4(),
      name: faker.vehicle.vehicle(),
      address: faker.location.streetAddress(),
      status: true,
      id_geofence: geofences[Math.floor(Math.random() * geofences.length)].id_geofence,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.stops.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.stops.findMany({
      where: {
        id_stop: { in: objects.map(c => c.id_stop) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  }
  catch (error) {
    console.error('Error seeding units:', error);
    return [];
  }
  finally {
    await prisma.$disconnect();
  }
};