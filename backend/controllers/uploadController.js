import Record from "../models/Record.js";
import { classifyImage } from "../services/classifier.js";
import fs from "fs";

/**
 * Handles image upload, ML classification, and DB storage. (Module B4)
 */
const uploadRecord = async (req, res) => {
  // Multer saves the file to req.file
  const imagePath = req.file?.path;
  const { lat, lng } = req.body; // lat and lng from users

  const userId = req.user?.userId;

  if (!imagePath || !lat || !lng || !userId) {
    return res.status(400).json({
      message: "Missing required data: image, lat, lng, or user authentication.",
    });
  }

  try {
    // 1. Run Classification (Module B3)
    const classificationResult = await classifyImage(imagePath);
    const { label, confidence } = classificationResult;

    // 2. Save record to DB (Module B4)
    const newRecord = new Record({
      userId, // 👈 ObjectId from JWT
      label,
      confidence,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      image_url: imagePath.replace(/\\/g, "/"),
    });

    const savedRecord = await newRecord.save();

    // 3. Return the saved record
    res.status(201).json(savedRecord);
  } catch (error) {
    console.error("Error during record creation:", error);

    // Clean up uploaded file if DB save fails
    if (imagePath && fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    res.status(500).json({
      message: "Failed to process and save record.",
      error: error.message,
    });
  }
};

export { uploadRecord };
