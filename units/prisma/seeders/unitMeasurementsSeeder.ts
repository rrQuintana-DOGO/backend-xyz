import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const unitMeasurementSeeder = async (count: number) => {
  try {
    // Crear un array con la cantidad deseada de objetos
    const objects = Array.from({ length: count }, () => ({
      id_unit_measurement: uuidv4(),
      name: faker.finance.accountName(),
      symbol: faker.finance.transactionType(),
      conversion: {
        farenheit: null,
        celcius: null
      },
      status: true,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.unit_measurements.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.unit_measurements.findMany({
      where: {
        id_unit_measurement: { in: objects.map(c => c.id_unit_measurement) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding unit_measurements:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};