import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const setpointsSeeder = async () => {
  try {
    const unit_measurements = await prisma.unit_measurements.findMany();
  
    const setpointsNames = [
      'Temperatura',
      'Humedad',
      'Presión',
      'Velocidad',
      'Distancia',
      'Tiempo',
      'Volumen',
      'Peso',
      'Área',
      'Energía'
    ];

    const objects = setpointsNames.map(name => ({
      id_setpoint: uuidv4(),
      name: name,
      optimus_temp: faker.number.float({ min: 0, max: 100 }),
      minimum_range: faker.number.float({ min: 0, max: 100 }),
      maximum_range: faker.number.float({ min: 100, max: 200 }),
      status: true,
      id_unit_measurement: unit_measurements[Math.floor(Math.random() * unit_measurements.length)].id_unit_measurement
    }));

    await prisma.setpoints.createMany({
      data: objects,
    });

    const createdRecords = await prisma.setpoints.findMany({
      where: {
        id_setpoint: { in: objects.map(c => c.id_setpoint) },
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