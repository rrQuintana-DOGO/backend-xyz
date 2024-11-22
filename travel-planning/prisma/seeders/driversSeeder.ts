import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const driverSeeder = async () => {
  try {

    const liscence_types = await prisma.license_types.findMany();

    // const driversNames = [
    //   'Juan Perez',
    //   'Pedro Rodriguez',
    //   'Maria Lopez',
    //   'Jose Hernandez',
    //   'Ana Martinez',
    //   'Luis Gonzalez',
    //   'Carlos Ramirez',
    //   'Laura Torres',
    //   'Sofia Flores',
    //   'Jorge Diaz'
    // ];

    const driversNames = [
      'Diego Kaleb Samano Rodriguez',
    ]

    // Crear un array con la cantidad deseada de objetos
    const objects = driversNames.map(name => ({
      id_driver: uuidv4(),
      name: name,
      phone: faker.phone.number(),
      email: faker.internet.email(),
      rc_code : faker.person.fullName(),
      license_expiration : faker.date.future(),
      license_type_id : liscence_types[Math.floor(Math.random() * liscence_types.length)].id_license_type,
      status: true,

    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.drivers.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.drivers.findMany({
      where: {
        id_driver: { in: objects.map(c => c.id_driver) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding carriers:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};