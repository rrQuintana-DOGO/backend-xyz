import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userSeeder = async (count: number) => {
  try {
  
    const credentials = await prisma.credentials.findMany();
    const time_zones = await prisma.time_zones.findMany();
    
    // Crear un array con la cantidad deseada de objetos
    const objects = Array.from({ length: count }, () => {

      return {
        id_user: uuidv4(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        email_verified: true,
        phone: faker.phone.number(),
        phone_verified: true,
        id_credential: credentials[Math.floor(Math.random() * credentials.length)].id_credential,
        id_time_zone: time_zones[Math.floor(Math.random() * time_zones.length)].id_time_zone,
      };
    });

    // Insertar todos los objetos en la base de datos
    await prisma.users.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.users.findMany({
      where: {
        id_user: { in: objects.map(g => g.id_user) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding uers:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};