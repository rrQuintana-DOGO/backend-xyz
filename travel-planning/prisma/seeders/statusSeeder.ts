import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const statusSeeder = async () => {
  try {
    const statusNames = [
      'Activo',
      'Inactivo',
      'En proceso',
      'Finalizado',
      'Cancelado',
      'Pendiente',
      'Rechazado',
      'Aceptado',
      'En revisión',
      'En espera'
    ];

    // Crear un array con la cantidad deseada de objetos
    const objects = statusNames.map(name => ({
      id_status: uuidv4(),
      name: name,
      status: true,
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.status.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.status.findMany({
      where: {
        id_status: { in: objects.map(c => c.id_status) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding status:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};