import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const journeyTypesSeeder = async () => {
  try {

    const journeyTypeNames = [
      'Senderismo',
      'Ciclismo',
      'Automovilismo',
      'Motociclismo',
      'Navegación',
      'Vuelo',
      'Tren',
      'Autobús',
      'Caminata',
      'Safari'
    ];

    // Crear un array con la cantidad deseada de objetos
    const objects = journeyTypeNames.map(name => ({
      id_journey_type: uuidv4(),
      name: name,
      description: faker.lorem.word(255),
      status: true,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.journey_types.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.journey_types.findMany({
      where: {
        id_journey_type: { in: objects.map(c => c.id_journey_type) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding journey_types:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};