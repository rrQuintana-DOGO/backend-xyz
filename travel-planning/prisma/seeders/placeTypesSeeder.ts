import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const placeTypeSeeder = async (count: number) => {
  try {
    // Crear un array con la cantidad deseada de objetos
    const objects = Array.from({ length: count }, () => ({
      id_place_type: uuidv4(),
      name: faker.person.fullName(),
      status: true,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.place_types.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.place_types.findMany({
      where: {
        id_place_type: { in: objects.map(c => c.id_place_type) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding unit_types:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};