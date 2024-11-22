import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const coordsArray = [
  { latitude: 25.641529, longitude: -100.2832918 },
  { latitude: 25.6406559, longitude: -100.2836993 },
  { latitude: 25.6400265, longitude: -100.2831861 },
  { latitude: 25.6394831, longitude: -100.284375 },
  { latitude: 25.6392751, longitude: -100.2842777 },
  { latitude: 25.6401172, longitude: -100.2826858 },
  { latitude: 25.6407021, longitude: -100.2814007 },
  { latitude: 25.640891, longitude: -100.2810044 },
  { latitude: 25.6418414, longitude: -100.2789813 },
  { latitude: 25.6420638, longitude: -100.2785877 },
  { latitude: 25.64243, longitude: -100.278025 },
  { latitude: 25.6428729, longitude: -100.2771649 },
  { latitude: 25.6429652, longitude: -100.2767734 },
  { latitude: 25.6429832, longitude: -100.2766278 },
  { latitude: 25.6429928, longitude: -100.2765042 },
  { latitude: 25.6429941, longitude: -100.2742526 },
  { latitude: 25.6430871, longitude: -100.2740159 },
  { latitude: 25.6432266, longitude: -100.2738611 },
  { latitude: 25.6433635, longitude: -100.2739057 },
  { latitude: 25.6467449, longitude: -100.2747899 },
  { latitude: 25.6468676, longitude: -100.2744759 },
  { latitude: 25.6475226, longitude: -100.2728172 },
  { latitude: 25.6466766, longitude: -100.2683983 },
  { latitude: 25.6464968, longitude: -100.2682798 },
  { latitude: 25.6467922, longitude: -100.2678327 },
  { latitude: 25.6469766, longitude: -100.267793 },
  { latitude: 25.6472691, longitude: -100.2677456 },
  { latitude: 25.6474608, longitude: -100.267704 },
  { latitude: 25.6476034, longitude: -100.267661 },
  { latitude: 25.6480314, longitude: -100.2675913 },
  { latitude: 25.6490511, longitude: -100.2668349 },
  { latitude: 25.649137, longitude: -100.2667531 },
  { latitude: 25.6500966, longitude: -100.2664758 },
  { latitude: 25.6505478, longitude: -100.2663615 },
  { latitude: 25.6510408, longitude: -100.2661629 },
  { latitude: 25.6512309, longitude: -100.2660318 },
  { latitude: 25.6515597, longitude: -100.2657949 },
  { latitude: 25.6525938, longitude: -100.2650752 },
  { latitude: 25.6529223, longitude: -100.2648544 },
  { latitude: 25.6543533, longitude: -100.2638787 },
  { latitude: 25.6564001, longitude: -100.2624724 },
  { latitude: 25.6577392, longitude: -100.2615549 },
  { latitude: 25.6581984, longitude: -100.2612291 },
  { latitude: 25.6588144, longitude: -100.2608112 },
  { latitude: 25.6589032, longitude: -100.260753 },
  { latitude: 25.6594906, longitude: -100.2603492 },
  { latitude: 25.6600523, longitude: -100.2599629 },
  { latitude: 25.6605616, longitude: -100.2596022 },
  { latitude: 25.6609736, longitude: -100.2593314 },
  { latitude: 25.6612657, longitude: -100.2591376 },
  { latitude: 25.6613348, longitude: -100.2590962 },
  { latitude: 25.6616156, longitude: -100.2589261 },
  { latitude: 25.6621313, longitude: -100.2586032 },
  { latitude: 25.6632252, longitude: -100.2578197 },
  { latitude: 25.6634, longitude: -100.2576278 },
  { latitude: 25.6636877, longitude: -100.2574452 },
  { latitude: 25.6639386, longitude: -100.2572746 },
  { latitude: 25.6669599, longitude: -100.2550278 },
  { latitude: 25.6672704, longitude: -100.2547686 },
  { latitude: 25.6684895, longitude: -100.2537483 },
  { latitude: 25.6689175, longitude: -100.2534183 },
  { latitude: 25.6691533, longitude: -100.2532257 },
  { latitude: 25.6715229, longitude: -100.2513071 },
  { latitude: 25.6715774, longitude: -100.2512632 },
  { latitude: 25.6723576, longitude: -100.2490971 },
  { latitude: 25.6724585, longitude: -100.2479204 },
  { latitude: 25.6725236, longitude: -100.2472974 },
  { latitude: 25.6725578, longitude: -100.246943 },
  { latitude: 25.6727029, longitude: -100.245554 },
  { latitude: 25.6741622, longitude: -100.2443749 },
  { latitude: 25.6742822, longitude: -100.2443935 },
  { latitude: 25.6744258, longitude: -100.2444118 },
  { latitude: 25.6747117, longitude: -100.2443961 },
  { latitude: 25.6751383, longitude: -100.2443332 },
  { latitude: 25.6755504, longitude: -100.2442959 },
  { latitude: 25.6759947, longitude: -100.2442605 },
  { latitude: 25.6764287, longitude: -100.2442179 },
  { latitude: 25.6768594, longitude: -100.2441832 },
  { latitude: 25.6772706, longitude: -100.2441449 },
  { latitude: 25.6777101, longitude: -100.244103 },
  { latitude: 25.6781439, longitude: -100.2440633 },
  { latitude: 25.6785884, longitude: -100.2440282 },
  { latitude: 25.6791709, longitude: -100.2439892 },
  { latitude: 25.679297, longitude: -100.2439971 },
  { latitude: 25.679376, longitude: -100.2440262 },
  { latitude: 25.6794561, longitude: -100.2440563 },
  { latitude: 25.6805901, longitude: -100.2439055 },
  { latitude: 25.6806584, longitude: -100.2404713 },
  { latitude: 25.6808071, longitude: -100.2398677 },
  { latitude: 25.6809432, longitude: -100.2395814 },
  { latitude: 25.6809982, longitude: -100.23948 },
  { latitude: 25.6810987, longitude: -100.2392883 },
  { latitude: 25.6820764, longitude: -100.236876 },
  { latitude: 25.6824028, longitude: -100.2361679 },
  { latitude: 25.68263, longitude: -100.2355295 },
  { latitude: 25.6831388, longitude: -100.2355 },
  { latitude: 25.6834603, longitude: -100.2355 },
  { latitude: 25.6836597, longitude: -100.235496 },
  { latitude: 25.6841571, longitude: -100.2354815 },
  { latitude: 25.6846955, longitude: -100.2354571 },
  { latitude: 25.6851453, longitude: -100.2354533 },
  { latitude: 25.685608, longitude: -100.2353754 },
  { latitude: 25.6860769, longitude: -100.2352466 },
  { latitude: 25.6860902, longitude: -100.2336922 },
]

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