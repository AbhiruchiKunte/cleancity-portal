// models/Record.ts
import mongoose from "mongoose";

// Define the record schema
const RecordSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",  
    required: true 
  },
  label: { type: String, required: true },
  confidence: { type: Number, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  image_url: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  validated: { type: Boolean, default: false }
}, { timestamps: true });

const Record = mongoose.model("Record", RecordSchema);
export default Record;
