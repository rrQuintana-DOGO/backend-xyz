import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// const coordsArray = [
//   { latitude: 17.166239659199654, longitude: -96.78676571099837},
//   { latitude: 17.163397225293558, longitude: -96.78631359949837},
//   { latitude: 17.161946159375344, longitude: -96.78575060370046},
//   { latitude: 17.157353797910808, longitude:  -96.78394197825276 },
//   { latitude: 17.153830342191597, longitude:  -96.78255677027003 },
//   { latitude: 17.1484891262012, longitude: -96.78025482917226 },
//   { latitude: 17.138177705124477, longitude: -96.77584859243849 },
//   { latitude: 17.129859024907564, longitude: -96.77063782264975},
//   { latitude: 17.1263318976073, longitude: -96.76791449925194},
//   { latitude: 17.123181397233125, longitude:  -96.76540617506976 },
// ];

const coordsArray = [
  { latitude: 25.641197440014864, longitude: -100.28304077467403 },
  { latitude: 27.695175725176355, longitude: -99.74796594754365 },
  { latitude: 27.952970905838416, longitude: -99.38001786739679 },
  { latitude: 29.519651885880343, longitude: -98.48429997116423 },
];

export const placesSeeder = async () => {
  try {
    const place_types = await prisma.place_types.findMany();

    // const placesNames = [
    //   'Hotel',
    //   'Restaurante',
    //   'Aeropuerto',
    //   'Terminal de buses',
    //   'Terminal de trenes',
    //   'Estación de servicio',
    //   'Parque',
    //   'Museo',
    //   'Centro comercial',
    //   'Playa'
    // ];

    const placesNames = [
      'Paseo del country',,
      'Puente internacional',
      'Encinal',
      'San Antonio',
    ];

    // Crear geofences y obtener sus IDs
    const geofences = await Promise.all(coordsArray.map(async (coords) => {
      const geofence = await prisma.geofences.create({
        data: {
          id_geofence: uuidv4(),
          coords: {
            latitude: coords.latitude,
            longitude: coords.longitude
          },
          status: true,
        },
      });
      return geofence;
    }));

    // Crear un array con la cantidad deseada de objetos
    const objects = placesNames.map((name, index) => ({
      id_place: uuidv4(),
      name: name,
      address: faker.location.streetAddress(),
      location: faker.vehicle.vehicle(),
      status: true,
      id_place_type: place_types[Math.floor(Math.random() * place_types.length)].id_place_type,
      id_geofence: geofences[index].id_geofence, // Asignar la geofence correspondiente
    }));

    // Insertar todos los objetos en la base de datos a su tabla correspondiente
    await prisma.places.createMany({
      data: objects,
    });

    // Consultar y devolver los elementos recién creados
    const createdRecords = await prisma.places.findMany({
      where: {
        id_place: { in: objects.map(c => c.id_place) },
      },
    });

    return `Se crearon ${createdRecords.length} registros exitosamente`;
  } catch (error) {
    console.error('Error seeding places:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
};