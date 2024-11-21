// prisma/seeders/carrierSeeder.ts
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const timeZoneSeeders = async (count: number) => {
  try {
    // Crear un array con la cantidad deseada de carriers
    const objects = Array.from({ length: count }, () => ({
      id_time_zone: uuidv4(),
      name: faker.location.timeZone(),
      off_set: parseFloat(faker.location.zipCode()),
      status: true
    }));

    // Insertar todos los carriers en la base de datos
    await prisma.time_zones.createMany({
      data: objects,
    });

    // Consultar y devolver los carriers recién creados
    const createdRecords = await prisma.time_zones.findMany({
      where: {
        id_time_zone: { in: objects.map(c => c.id_time_zone) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding time_zones:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};