


import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const groupSeeder = async (count: number) => {
  try {
    const conf = await prisma.config_groups.findMany();

    // Crear un array con la cantidad deseada de objetos
    const objects = Array.from({ length: count }, () => ({
      id_group: uuidv4(),
      name: faker.vehicle.vehicle(),
      status: true,
      id_config_group: conf[Math.floor(Math.random() * conf.length)].id_config_group,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.groups.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.groups.findMany({
      where: {
        id_config_group: { in: objects.map(c => c.id_config_group) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding groups:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};