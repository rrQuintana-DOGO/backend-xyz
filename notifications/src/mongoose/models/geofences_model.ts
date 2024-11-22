import { Schema, model } from 'mongoose';

const geofencesTelemetrySchema = new Schema({
    _id: { type: String, required: true },
    event_type: { type: String, required: true },
    id_device: { type: Number, required: true },
    geofence: { type: String, required: true },
    datetime: { type: Number, required: true },
    event_uuid: { type: String, required: true },    
    client_uuid: { type: String, required: true },
    latitude: { type: String, required: true },
    longitude: { type: String, required: true },
    event_date: { type: Number, required: true },    

});
//{ _id: false }
const geofencesTelemetry = model('geofences_telemetry', geofencesTelemetrySchema);

export { geofencesTelemetry, geofencesTelemetrySchema };
