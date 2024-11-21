// prisma/seeders/carrierSeeder.ts
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const maintenanceTypesSeeder = async (count: number) => {
  try {
    const maintenance_types = Array.from({ length: count }, () => ({
      id_maintenance_type: uuidv4(),
      name: faker.commerce.department(),
      status: true
    }));

    await prisma.maintenance_types.createMany({
      data: maintenance_types,
    });

    const createdMaintenanceTypes = await prisma.maintenance_types.findMany({
      where: {
        id_maintenance_type: { in: maintenance_types.map(c => c.id_maintenance_type) },
      },
    });

    return `Se crearon ${createdMaintenanceTypes.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding maintenance types:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};