import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const contactSeeder = async (count: number) => {
  try {

    // Crear un array con la cantidad deseada de objetos
    const objects = Array.from({ length: count }, () => ({
      id_contact: uuidv4(),
      name: faker.person.fullName(),
      email : faker.internet.email(),
      phone : faker.phone.number(),
      address: faker.person.jobTitle(),
      status: true,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.contacts.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.contacts.findMany({
      where: {
        id_contact: { in: objects.map(c => c.id_contact) },
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