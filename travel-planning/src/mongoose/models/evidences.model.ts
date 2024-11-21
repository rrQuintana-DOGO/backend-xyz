import { Schema, model } from 'mongoose';

const evidencesSchema = new Schema({
    _id: { type: String, required: true },
    file_name: { type: String, required: true },    
    description: { type: String, required: true },
    url: { type: String, required: false },
    related: { type: Object, required: true },
    content_type: { type: String, required: true },
}, { _id: false, timestamps: true });

const Evidences = model('evidences', evidencesSchema);

export { Evidences, evidencesSchema };