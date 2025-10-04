// models/Record.js
import mongoose from "mongoose";

const RecordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  label: { type: String, required: true },
  confidence: { type: Number, required: true },
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  image_url: { type: String, required: true },
   embedding: { type: [Number], default: [] },
  linkedRecordId: { type: mongoose.Schema.Types.ObjectId, ref: "Record" },
  timestamp: { type: Date, default: Date.now },
  validated: { type: Boolean, default: false },
  validationStatus: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  validationNotes: { type: String },
  validatedAt: { type: Date },
  validatedBy: { type: String },
}, { timestamps: true });

const Record = mongoose.model("Record", RecordSchema);
export default Record;
