import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const clientSeeder = async () => {
  try {
    const clientNames = [
      "Juan Pérez",
      "María García",
      "Carlos Sánchez",
      "Ana Martínez",
      "Luis Rodríguez",
      "Carmen Fernández",
      "José López",
      "Laura González",
      "Miguel Hernández",
      "Lucía Díaz"
    ];

    // Crear un array con la cantidad deseada de objetos
    const objects = clientNames.map(name => ({
      id_client: uuidv4(),
      name: name,
      company_name: faker.company.name(),
      address: faker.location.streetAddress(),
      status: true,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.clients.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.clients.findMany({
      where: {
        id_client: { in: objects.map(c => c.id_client) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding clients:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};