import { Schema, model } from 'mongoose';

const tripLogsSchema = new Schema({
    _id: { type: String, required: true },
    id_trip: { type: String, required: true },
    id_user: { type: String, required: true },
    comment: { type: String, required: true },
    id_status: { type: String, required: true },
    id_situation: { type: String, required: true },
    created_at: { type: Number, required: true },
}, { _id: false });

const TripLogs = model('trip_logs', tripLogsSchema);

export { TripLogs, tripLogsSchema };