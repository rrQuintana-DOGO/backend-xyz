import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const unitTypeSeeder = async (count: number) => {
  try {
    // Crear un array con la cantidad deseada de objetos
    const objects = Array.from({ length: count }, () => ({
      id_unit_type: uuidv4(),
      name: faker.person.fullName(),
      optimal_fuel_performance: faker.number.float({ min: 0, max: 100 }),
      status: true,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.unit_types.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.unit_types.findMany({
      where: {
        id_unit_type: { in: objects.map(c => c.id_unit_type) },
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