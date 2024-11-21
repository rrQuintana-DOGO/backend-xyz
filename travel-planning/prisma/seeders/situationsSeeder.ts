import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const situationsSeeder = async () => {
  try {
    const objects = [
      {
        id_situation: uuidv4(),
        name: 'TNS',
        status: true
      },
      {
        id_situation: uuidv4(),
        name: 'TOR',
        status: true
      },
      {
        id_situation: uuidv4(),
        name: 'TC',
        status: true
      }
    ];

    const existingNames = await prisma.situations.findMany({
      where: {
        name: { in: objects.map(c => c.name) },
      },
      select: {
        name: true,
      },
    });

    const existingNamesSet = new Set(existingNames.map(e => e.name));
    const newObjects = objects.filter(obj => !existingNamesSet.has(obj.name));

    if (newObjects.length > 0) {
      await prisma.situations.createMany({
        data: newObjects,
      });
    }

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.situations.findMany({
      where: {
        id_situation: { in: newObjects.map(c => c.id_situation) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  }
  catch (error) {
    console.error('Error seeding situations:', error);
    return [];
  }
  finally {
    await prisma.$disconnect();
  }
};