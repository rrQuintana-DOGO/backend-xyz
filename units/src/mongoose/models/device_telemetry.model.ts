import { Schema, model } from 'mongoose';

const deviceTelemetrySchema = new Schema({
    _id: { type: String, required: true },
    id_device: { type: String, required: true },
    data: { type: Object, required: true },
}, { _id: false });

const DeviceTelemetry = model('device_telemetry', deviceTelemetrySchema);

export default DeviceTelemetry;