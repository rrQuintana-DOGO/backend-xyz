import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const fuelTypeSeeder = async (count: number) => {
  try {
    const unit_measurements = await prisma.unit_measurements.findMany();

    // Crear un array con la cantidad deseada de objetos
    const objects = Array.from({ length: count }, () => ({
      id_fuel_type: uuidv4(),
      name: faker.color.human(),
      id_unit_measurement: unit_measurements[Math.floor(Math.random() * unit_measurements.length)].id_unit_measurement,
      status: true
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.fuel_types.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.fuel_types.findMany({
      where: {
        id_fuel_type: { in: objects.map(c => c.id_fuel_type) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding fuel_types:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};