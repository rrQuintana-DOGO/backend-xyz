// prisma/seeders/carrierSeeder.ts
import { v4 as uuidv4 } from 'uuid';
import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const suppliersSeeder = async (count: number) => {
  try {
    const suppliers = Array.from({ length: count }, () => ({
      id_supplier: uuidv4(),
      name: faker.person.fullName(),
      type: faker.database.type(),
      address: faker.location.streetAddress(),
      cp: faker.location.zipCode(),
      city: faker.location.city(),
      country: faker.location.country(),
      status: true
    }));

    await prisma.suppliers.createMany({
      data: suppliers,
    });

    const createdSuppliers = await prisma.suppliers.findMany({
      where: {
        id_supplier: { in: suppliers.map(c => c.id_supplier) },
      },
    });

    return `Se crearon ${createdSuppliers.length} registros exitosamente`;
  } 
  catch (error) {
    console.error('Error seeding suppliers:', error);
    return [];
  } 
  finally {
    await prisma.$disconnect();
  }
};