import { Schema, model } from 'mongoose';

const notificationsTelemetrySchema = new Schema({
    _id: { type: String, required: true },
    alert: { type: String, required: true },
    id_device: { type: Number, required: true },
    value: { type: Number, required: true },
    datetime: { type: Number, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    event_uuid: { type: String, required: true },
    client_uuid: { type: String, required: true },
    event_date: { type: Number, required: true },
    duration: { type: Number, required: true },
});
//{ _id: false }
const notificationsTelemetry = model('notifications_telemetry', notificationsTelemetrySchema);

export { notificationsTelemetry, notificationsTelemetrySchema };