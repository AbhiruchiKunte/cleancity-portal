import Record from '../models/Record.js';
import { classifyImage } from '../services/classifier.js';
import fs from 'fs';
import path from 'path';

/**
 * Handles image upload, ML classification, and DB storage. (Module B4)
 */
const uploadRecord = async (req, res) => {
  // Multer saves the file to req.file
  const imagePath = req.file?.path;
  const { lat, lng, userId } = req.body;

  if (!imagePath || !lat || !lng || !userId) {
    return res.status(400).json({ message: 'Missing required data: image, lat, lng, or userId.' });
  }

  try {
    // 1. Run Classification (Module B3)
    const classificationResult = await classifyImage(imagePath);
    const { label, confidence } = classificationResult;

    // 2. Save record to DB (Module B4)
    const newRecord = new Record({
      userId,
      label,
      confidence,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      // The image_url is the path on the server (e.g., 'uploads/image-12345.jpg')
      image_url: imagePath.replace(/\\/g, "/") 
    });

    const savedRecord = await newRecord.save();

    // 3. Return the saved record
    res.status(201).json(savedRecord);

  } catch (error) {
    console.error('Error during record creation:', error);
    // Attempt to clean up the uploaded file if DB save fails
    if (imagePath && fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
    }
    res.status(500).json({ message: 'Failed to process and save record.', error: error.message });
  }
};

export { uploadRecord };
