import { Schema, model } from 'mongoose';

const notificationsHistorySchema = new Schema({
    _id: { type: String, required: true },
    id_unit: { type: String, required: true },
    id_trip: { type: String, required: true },
    id_event: { type: String, required: true },
    id_trip_log: { type: String, required: true },
    register_date: { type: Number, required: true },
    id_trip_log_attention: { type: String, required: true },
    id_user_attention: { type: String, required: true },
    attention_date: { type: Number, required: true },
}, { _id: false });

const NotificationsHistory = model('notifications_history', notificationsHistorySchema);

export { NotificationsHistory, notificationsHistorySchema };