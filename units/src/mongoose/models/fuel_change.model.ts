import { Schema, model } from 'mongoose';

const fuelChangeSchema = new Schema({
    _id: { type: String, required: true },
    id_unit: { type: String, required: true },
    cost: { type: Number, required: true },
    id_event: { type: String, required: true },
    real_date: { type: Number, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    fuel_charge: { type: Number, required: true },
    type: { type: String, required: true },
    register_date: { type: Number, required: true },
}, { _id: false });

const FuelChange = model('fuel_change', fuelChangeSchema);

export default FuelChange;