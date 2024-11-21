import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const tripTypesSeeder = async () => {
  try {
    const tripTypeNames = [
      'Normal',
      'Aventura',
      'Cultural',
      'Gastronómico',
      'Deportivo',
      'Relajación',
      'Negocios',
      'Familiar',
      'Romántico',
      'Ecológico'
    ];
    // Crear un array con la cantidad deseada de objetos
    const objects = tripTypeNames.map(name => ({
      id_trip_type: uuidv4(),
      name: name,
      description: faker.lorem.word(255),
      status: true,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.trip_types.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.trip_types.findMany({
      where: {
        id_trip_type: { in: objects.map(c => c.id_trip_type) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;

  } 
  catch (error) {
    console.error('Error seeding trip_types:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};