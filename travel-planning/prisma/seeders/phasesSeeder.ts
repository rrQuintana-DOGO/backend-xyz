import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { symbol } from 'joi';

const prisma = new PrismaClient();

export const phasesSeeder = async () => {
  try {
    const objects = [
      {
        id_phase: uuidv4(),
        name: 'Viaje no iniciado',
        symbol: 'TNS',
        status: true
      },
      {
        id_phase: uuidv4(),
        name: 'Viaje en ruta',
        symbol: 'TOR',
        status: true
      },
      {
        id_phase: uuidv4(),
        name: 'Viaje completado',
        symbol: 'TC',
        status: true
      }
    ];

    const existingSymbols = await prisma.phases.findMany({
      where: {
        symbol: { in: objects.map(c => c.symbol) },
      },
      select: {
        symbol: true,
      },
    });

    const existingSymbolsSet = new Set(existingSymbols.map(e => e.symbol));
    const newObjects = objects.filter(obj => !existingSymbolsSet.has(obj.symbol));

    if (newObjects.length > 0) {
      await prisma.phases.createMany({
        data: newObjects,
      });
    }

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.phases.findMany({
      where: {
        id_phase: { in: newObjects.map(c => c.id_phase) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  }
  catch (error) {
    console.error('Error seeding phases:', error);
    return [];
  }
  finally {
    await prisma.$disconnect();
  }
};
