import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const configGroupsSeeder = async (count: number) => {
  try {
    // Crear un array con la cantidad deseada de objetos
    const config_groups = Array.from({ length: count }, () => ({
      id_config_group: uuidv4(),
      parameters: {
        trip_type: null,
        place: null,
        automatic_join: null
      },
      status: true
    }));

    // Insertar todos los objetos en la base de datos
    await prisma.config_groups.createMany({
      data: config_groups,
    });

    // Consultar y devolver los elementos recién creados
    const createdConfigGroups = await prisma.config_groups.findMany({
      where: {
        id_config_group: { in: config_groups.map(c => c.id_config_group) },
      },
    });

    return `Se crearon ${createdConfigGroups.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding config_groups:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};