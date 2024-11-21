import { Schema, model } from 'mongoose';

// Subschema for Device
const DeviceSchema = new Schema({
  id: { type: Number, required: false },
  name: { type: String, required: false },
  selfName: { type: String, required: false },
  typeId: { type: Number, required: false },
});

// Subschema for Gsm
const GsmSchema = new Schema({
  cellid: { type: Number, required: false },
  lac: { type: Number, required: false },
  mcc: { type: Number, required: false },
  mnc: { type: Number, required: false },
});

// Subschema for Position
const PositionSchema = new Schema({
  altitude: { type: Number, required: false },
  direction: { type: Number, required: false },
  hdop: { type: Number, required: false },
  latitude: { type: Number, required: false },
  lbsLatitude: { type: Number },
  lbsLongitude: { type: Number },
  longitude: { type: Number, required: false },
  speed: { type: Number, required: false },
  timestamp: { type: Number, required: false },
});

// Main schema for MqttData
const MqttDataSchema = new Schema({
  batteryLevel: { type: Number, required: false },
  channelId: { type: Number, required: false },
  device: { type: DeviceSchema, required: false },
  gsm: { type: GsmSchema, required: false },
  ident: { type: String, required: false },
  messageBufferedStatus: { type: Boolean, required: false },
  peer: { type: String, required: false },
  position: { type: PositionSchema, required: false },
  protocolId: { type: Number, required: false },
  protocolVersion: { type: String, required: false },
  rebootDinId: { type: Number, required: false },
  rebootReasonEnum: { type: Number, required: false },
  recordSeqnum: { type: Number, required: false },
  reportCode: { type: String, required: false },
  reportReason: { type: Number, required: false },
  serverTimestamp: { type: Number, required: false },
  timestamp: { type: Number, required: false },
  timestampKey: { type: Number, required: false },
});

const MqttData = model('MqttData', MqttDataSchema);

export { MqttData, MqttDataSchema };
