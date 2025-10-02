import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import path from 'path';

let model;

// Waste classification categories
const categories = [
    'cardboard', 
    'glass', 
    'metal', 
    'organic', 
    'paper', 
    'plastic', 
    'recyclable', 
    'trash'
];


/**
 * Load the real TensorFlow.js model from the backend/models directory.
 */
async function loadModel() {
  try {
    const modelDir = path.resolve(process.cwd(), '../models/waste_model_8class_tfjs/model.json');
    const modelPath = 'file://' + modelDir; 
    
    model = await tf.loadLayersModel(modelPath);
    console.log('✅ Real 8-class MobileNetV2 model loaded successfully from:', modelPath);
    
  } catch (error) {
    console.error('Error loading REAL ML model. Falling back to MOCK:', error.message);
    
    // Fallback to a mock model structure (8 dummy classes)
    model = {
      predict: () => {
        const mockResult = [
          [0.05, 0.05, 0.10, 0.60, 0.05, 0.05, 0.05, 0.05]
        ];
        return tf.tensor(mockResult);
      }
    };
  }
}

/**
 * Classifies an image file using the loaded TF.js model.
 * @param {string} imagePath - The local file path of the image.
 * @returns {object} { label: string, confidence: number }
 */
async function classifyImage(imagePath) {
  if (!model) {
    return { label: 'unclassified_model_error', confidence: 0.0 };
  }

  // Ensure the tensor is explicitly disposed to prevent memory leaks
  let tensor = null;
  let prediction = null;

  try {
    const image = fs.readFileSync(imagePath);
    
    // 1. Decoding, Resizing, Batching, and Normalization to [0, 1]
    tensor = tf.node.decodeImage(image)
      .resizeNearestNeighbor([224, 224]) // MobileNetV2 input size
      .expandDims(0)                      
      .toFloat()
      .div(tf.scalar(255));              // Normalization
      
    // 2. Run prediction
    prediction = model.predict(tensor);
    const scores = prediction.dataSync(); 

    // 3. Post-processing: Find the index of the highest score
    const maxIndex = scores.indexOf(Math.max(...scores));
    const label = categories[maxIndex];
    const confidence = scores[maxIndex];

    return { 
      label: label || 'Unknown', 
      confidence: parseFloat(confidence.toFixed(4)) || 0.0
    };

  } catch (error) {
    console.error(`Classification error for ${path.basename(imagePath)}:`, error.message);
    return { label: 'unclassified_processing_error', confidence: 0.0 };
  } finally {
    if (tensor) tensor.dispose();
    if (prediction) prediction.dispose();
  }
}

// Ensure model is loaded on service startup
loadModel(); 

export { classifyImage };
