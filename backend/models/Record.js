import mongoose from 'mongoose';

const RecordSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  label: { type: String, required: true }, // Classified waste category
  confidence: { type: Number, required: true }, // ML prediction confidence
  lat: { type: Number, required: true }, // Latitude of the record
  lng: { type: Number, required: true }, // Longitude of the record
  image_url: { type: String, required: true }, // Path to the uploaded image
  timestamp: { type: Date, default: Date.now },
  validated: { type: Boolean, default: false } // Admin validation status
}, { timestamps: true });

const Record = mongoose.model('Record', RecordSchema);
export default Record;
