import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const coordsArray = [
  { latitude: 17.166239659199654, longitude: -96.78676571099837 },
  { latitude: 17.163397225293558, longitude: -96.78631359949837 },
  { latitude: 17.161946159375344, longitude: -96.78575060370046 },
  { latitude: 17.157353797910808, longitude: -96.78394197825276 },
  { latitude: 17.153830342191597, longitude: -96.78255677027003 },
  { latitude: 17.1484891262012, longitude: -96.78025482917226 },
  { latitude: 17.138177705124477, longitude: -96.77584859243849 },
  { latitude: 17.129859024907564, longitude: -96.77063782264975 },
  { latitude: 17.1263318976073, longitude: -96.76791449925194 },
  { latitude: 17.123181397233125, longitude: -96.76540617506976 },
];

export const geoRoutesSeeder = async () => {
  try {

    const objects = coordsArray.map(coord => ({
      id_georoute: uuidv4(),
      coords: {
        latitude: coord.latitude,
        longitude: coord.longitude
      },
      status: true,
    }));

    await prisma.georoutes.createMany({
      data: objects,
    });

    const createdRecords = await prisma.georoutes.findMany({
      where: {
        id_georoute: { in: objects.map(c => c.id_georoute) },
      },
    });

    createdRecords.forEach(async (record, index) => {
      await prisma.waypoints.create({
        data: {
          id_waypoint: uuidv4(),
          id_georoute: record.id_georoute,
          name: faker.lorem.words(2),
          description: faker.lorem.words(10),
          status: true,
          order: index + 1
        },
      });
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } catch (error) {
    console.error('Error seeding :', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};