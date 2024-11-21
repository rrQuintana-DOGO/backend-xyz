import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const unitSeeder = async () => {
  try {
    const unit_types = await prisma.unit_types.findMany();
    const fuel_types = await prisma.fuel_types.findMany();

    const unitsNames = [
      'Camión',
      'Furgoneta',
      'Automóvil',
      'Motocicleta',
      'Bicicleta',
      'Autobús',
      'Trailer',
      'Barco',
      'Avión',
      'Helicóptero'
    ];

    // Crear un array con la cantidad deseada de objetos
    const objects = unitsNames.map(name => ({
      id_unit: uuidv4(),
      name: name,
      model: faker.vehicle.model(),
      plate: faker.vehicle.vin(),
      year: new Date().getFullYear(),
      status: true,
      id_unit_type: unit_types[Math.floor(Math.random() * unit_types.length)].id_unit_type,
      id_fuel_type: fuel_types[Math.floor(Math.random() * fuel_types.length)].id_fuel_type,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.units.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.units.findMany({
      where: {
        id_unit: { in: objects.map(c => c.id_unit) },
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