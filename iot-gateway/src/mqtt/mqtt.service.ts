import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { Kafka, Producer } from 'kafkajs';
import { envs } from '@config/envs';
import { CreateRecordDto } from '@mqtt/dto/createRecord.dto';
import { parseJsonStringToDto } from 'src/common/helpers/parseMqttMessage';
import { DataBaseManagerService } from '@dbManager/db_manager.service';
import { MqttDataSchema } from '@mongoose/models/mqtt_data.model';

@Injectable()
export class MqttService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MqttService.name);
  private mqttClient: MqttClient;
  private kafkaProducer: Producer;

  constructor(
    private readonly dbManager: DataBaseManagerService,
  ) {
    const kafka = new Kafka({
      brokers: [envs.kafkaBrokers],
    });

    this.kafkaProducer = kafka.producer();
  }

  async onModuleInit() {
    this.logger.log('Initializing MQTT Service...');
    
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
            this.logger.error(`Failed to subscribe to topic ${envs.flespiTopic}: ${err.message}`);
          } else {
            this.logger.log(`Subscribed to topic ${envs.flespiTopic}`);
          }
        });
      });

      this.mqttClient.on('message', async (topic, message) => {
        const receivedMessage = message.toString();
        this.logger.log(`Received message on topic ${topic}: ${receivedMessage}`);

        try {
          const parsedMessage = parseJsonStringToDto(receivedMessage);
          this.logger.log(`Parsed message: ${JSON.stringify(parsedMessage)}`);

          await this.saveRecord(parsedMessage, 'transportes_ffigueroa');

          await this.kafkaProducer.send({
            topic: 'iot-signals',
            messages: [{ key: topic, value: message.toString() }],
          });
          this.logger.log('Message sent to Kafka successfully');
        } catch (parseError) {
          this.logger.error('Failed to parse MQTT message:', parseError.message);
        }
      });

      this.mqttClient.on('error', (err) => {
        this.logger.error('MQTT Client Error:', err.message);
      });

    } catch (err) {
      this.logger.error('Failed to connect to Kafka or MQTT broker:', err.message);
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

    this.logger.log('Saving record:', createRecordDto);

    try {
      const record = new MqttData(createRecordDto);
      await record.save();

      this.logger.log('Record saved successfully:', record);
    } catch (err) {
      this.logger.error('Failed to save record:', err.message);
    }
  }
}