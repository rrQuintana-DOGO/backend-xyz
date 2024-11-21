import { Schema, model } from 'mongoose';

const notificationsSchema = new Schema({
    _id: { type: String, required: true },
    id_unit: { type: String, required: true },
    id_trip: { type: String, required: true },
    id_event: { type: String, required: true },
    id_trip_log: { type: String, required: true },
    register_date: { type: Number, required: true },
}, { _id: false });

const Notifications = model('notifications', notificationsSchema);

export { Notifications, notificationsSchema };