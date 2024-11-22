import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
  Inject,
} from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { Kafka, Producer } from 'kafkajs';
import { envs } from '@config/envs';
import { CreateRecordDto } from '@mqtt/dto/createRecord.dto';
import { parseJsonStringToDto } from 'src/common/helpers/parseMqttMessage';
import { DataBaseManagerService } from '@dbManager/db_manager.service';
import { MqttDataSchema } from '@mongoose/models/mqtt_data.model';
import { ClientProxy } from '@nestjs/microservices';
import { NATS_SERVICE } from '@config/services';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private mqttClient: MqttClient;
  private kafkaProducer: Producer;

  constructor(
    private readonly dbManager: DataBaseManagerService,
    @Inject(NATS_SERVICE) private readonly natsClient: ClientProxy,
  ) {
    const kafka = new Kafka({
      brokers: [envs.kafkaBrokers],
    });

    this.kafkaProducer = kafka.producer();
  }

  async onModuleInit() {
    this.logger.log('Initializing MQTT Service...');

    const coordinates = [
      { 'latitude': 17.165919, 'longitude': -96.7872166 },
      { 'latitude': 17.1658999, 'longitude': -96.7873645 },
      { 'latitude': 17.1643484, 'longitude': -96.7867198 },
      { 'latitude': 17.1636555, 'longitude': -96.7864319 },
      { 'latitude': 17.1631371, 'longitude': -96.7862165 },
      { 'latitude': 17.1624494, 'longitude': -96.7859307 },
      { 'latitude': 17.1609037, 'longitude': -96.785244 },
      { 'latitude': 17.1592317, 'longitude': -96.7845947 },
      { 'latitude': 17.1583256, 'longitude': -96.7842377 },
      { 'latitude': 17.1554659, 'longitude': -96.7831276 },
      { 'latitude': 17.1552831, 'longitude': -96.7830455 },
      { 'latitude': 17.1547032, 'longitude': -96.7827736 },
      { 'latitude': 17.1523524, 'longitude': -96.7817636 },
      { 'latitude': 17.1494712, 'longitude': -96.7805522 },
      { 'latitude': 17.1494383, 'longitude': -96.7805386 },
      { 'latitude': 17.1459682, 'longitude': -96.7791246 },
      { 'latitude': 17.1453252, 'longitude': -96.7788937 },
      { 'latitude': 17.1449606, 'longitude': -96.778732 },
      { 'latitude': 17.1447878, 'longitude': -96.7786554 },
      { 'latitude': 17.144648, 'longitude': -96.7785934 },
      { 'latitude': 17.1412717, 'longitude': -96.7771662 },
      { 'latitude': 17.1391214, 'longitude': -96.7762985 },
      { 'latitude': 17.1364869, 'longitude': -96.7752225 },
      { 'latitude': 17.1364055, 'longitude': -96.7751896 },
      { 'latitude': 17.1362056, 'longitude': -96.7751053 },
      { 'latitude': 17.135546, 'longitude': -96.7748224 },
      { 'latitude': 17.1345988, 'longitude': -96.7742909 },
      { 'latitude': 17.1328768, 'longitude': -96.7728932 },
      { 'latitude': 17.1323136, 'longitude': -96.7724319 },
      { 'latitude': 17.1315065, 'longitude': -96.771772 },
      { 'latitude': 17.1314411, 'longitude': -96.7717129 },
      { 'latitude': 17.1301657, 'longitude': -96.770675 },
      { 'latitude': 17.1277529, 'longitude': -96.7687201 },
      { 'latitude': 17.1276987, 'longitude': -96.7686765 },
      { 'latitude': 17.1259429, 'longitude': -96.7672325 },
      { 'latitude': 17.1255778, 'longitude': -96.7669342 },
      { 'latitude': 17.125247, 'longitude': -96.7666664 },
      { 'latitude': 17.1235465, 'longitude': -96.7653465 },
    ]

    let index = 0;

    // while (true) {
    //   await new Promise((resolve) => setTimeout(resolve, 3000));
    //   this.logger.log('Simulating MQTT data processing...');

    //   const coord = coordinates[index];
    //   this.natsClient.emit('mqtt-data-processed', {
    //     latitude: coord.latitude,
    //     longitude: coord.longitude,
    //     message: 'Simulated MQTT data'
    //   });

    //   index = (index + 1) % coordinates.length; // Avanza al siguiente punto, vuelve al inicio si llega al final
    // }

    try {
      await this.kafkaProducer.connect();
      this.logger.log('Connected to Kafka');

      this.mqttClient = connect(envs.mqttHost, {
        username: `FlespiToken ${envs.flespiToken}`,
      });

      this.mqttClient.on('connect', () => {
        this.logger.log('Connected to MQTT broker (Flespi)');

        this.mqttClient.subscribe(envs.flespiTopic, (err) => {
          if (err) {
            this.logger.error(
              `Failed to subscribe to topic ${envs.flespiTopic}: ${err.message}`,
            );
          } else {
            this.logger.log(`Subscribed to topic ${envs.flespiTopic}`);
          }
        });
      });

      this.mqttClient.on('message', async (topic, message) => {
        const receivedMessage = message.toString();
        //this.logger.log(`Received message on topic ${topic}: ${receivedMessage}`);

        try {
          const parsedMessage = parseJsonStringToDto(receivedMessage);
          //this.logger.log(`Parsed message: ${JSON.stringify(parsedMessage)}`);

          console.log('Parsed message:', parsedMessage);
          await this.saveRecord(parsedMessage, 'test');

          await this.kafkaProducer.send({
            topic: 'iot-signals',
            messages: [{ key: topic, value: message.toString() }],
          });
          //this.logger.log('Message sent to Kafka successfully');
        } catch (parseError) {
          this.logger.error(
            'Failed to parse MQTT message:',
            parseError.message,
          );
        }
      });

      this.mqttClient.on('error', (err) => {
        this.logger.error('MQTT Client Error:', err.message);
      });
    } catch (err) {
      this.logger.error(
        'Failed to connect to Kafka or MQTT broker:',
        err.message,
      );
    }
  }

  async onModuleDestroy() {
    if (this.mqttClient) {
      this.logger.log('Closing MQTT client connection...');
      this.mqttClient.end();
    }
    if (this.kafkaProducer) {
      this.logger.log('Disconnecting Kafka producer...');
      await this.kafkaProducer.disconnect();
    }
  }

  async saveRecord(createRecordDto: CreateRecordDto, slug: string) {
    const dbConnection = await this.dbManager.getMongoConnection(slug);
    const MqttData = dbConnection.model('MqttData', MqttDataSchema);

    //this.logger.log('Saving record:', createRecordDto);

    try {
      const record = new MqttData(createRecordDto);
      await record.save();

      this.natsClient.emit('mqtt-data-processed', record);
      this.logger.log('Record saved and sent to NATS');
    } catch (err) {
      this.logger.error('Failed to save record:', err.message);
    }
  }
}
