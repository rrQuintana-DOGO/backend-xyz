import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const credentialSeeder = async (count: number) => {
  try {
    // Crear un array con la cantidad deseada de objetos
    const objects = Array.from({ length: count }, () => ({
      id_credential: uuidv4(),
      username: faker.person.firstName() + '.' + faker.person.lastName(),
      password: faker.internet.password()
    }));

    // Insertar todos los objetos en la base de datos
    await prisma.credentials.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.credentials.findMany({
      where: {
        id_credential: { in: objects.map(c => c.id_credential) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding credentials:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};