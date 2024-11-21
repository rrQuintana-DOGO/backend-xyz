import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const carrierSeeder = async () => {
  try {

    const companyNames = [
      'Tech Solutions Inc.',
      'Global Enterprises',
      'Innovative Systems',
      'Future Tech',
      'Pioneer Services',
      'Elite Technologies',
      'Prime Solutions',
      'NextGen Innovations',
      'Visionary Enterprises',
      'Dynamic Networks'
    ];

    // Crear un array con la cantidad deseada de objetos
    const objects = companyNames.map(name => ({
      id_carrier: uuidv4(),
      name: name,
      phone: faker.phone.number(),
      email: faker.internet.email(),
      status: true,
      address: faker.location.streetAddress(),
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.carriers.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.carriers.findMany({
      where: {
        id_carrier: { in: objects.map(c => c.id_carrier) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding carriers:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};