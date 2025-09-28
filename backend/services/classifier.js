import * as tf from '@tensorflow/tfjs';
import fs from 'fs';
import path from 'path';

let model;

/**
 * Load the pre-trained MobileNet model (or fine-tuned model). (Module B3)
 * NOTE: Model loading is mocked here as real file paths are unavailable.
 */
async function loadModel() {
  try {
    // --- REAL WORLD LOGIC ---
    // Replace this with your actual model loading logic.
    // Example: model = await tf.loadLayersModel('file://path/to/model/model.json');
    console.log('--- MOCK ML: Model loaded successfully. ---');

    // Create a dummy model structure for prediction to avoid runtime errors
    // Since we can't load a real model, this is the safest way to proceed.
    model = {
      predict: () => {
        // Return a dummy prediction tensor
        const mockResult = [
          [0.05, 0.15, 0.70, 0.10] // Example probabilities for 4 classes
        ];
        return tf.tensor(mockResult);
      }
    };

  } catch (error) {
    console.error('Error loading ML model:', error);
    // If the model fails to load, the classification service might not function.
  }
}

/**
 * Classifies an image file using the loaded TF.js model. (Module B3)
 * @param {string} imagePath - The local file path of the image.
 * @returns {object} { label: string, confidence: number }
 */
async function classifyImage(imagePath) {
  if (!model) {
    // Fallback if model failed to load
    return { label: 'unclassified_model_error', confidence: 0.0 };
  }

  // Define mock waste categories for demonstration
  const categories = ['Plastic', 'Paper', 'Metal', 'Organic'];

  try {
    const image = fs.readFileSync(imagePath);
    // 1. Decode the image buffer into a tensor
    // 2. Resize it to 224x224 (MobileNet input size)
    // 3. Add batch dimension (expandDims(0))
    // 4. Convert to float and normalize to [0, 1]
    const tensor = tf.node.decodeImage(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255));
      
    // 5. Run prediction
    const prediction = model.predict(tensor);
    const scores = prediction.dataSync(); // Get raw prediction scores
    prediction.dispose(); // Clean up tensor memory

    // 6. Post-processing: Find the index of the highest score (most confident prediction)
    const maxConfidenceIndex = scores.indexOf(Math.max(...scores));
    const label = categories[maxConfidenceIndex];
    const confidence = scores[maxConfidenceIndex];

    // Clean up input tensor memory
    tensor.dispose(); 

    return { 
        label: label || 'Unknown', 
        confidence: parseFloat(confidence.toFixed(4)) || 0.0
    };

  } catch (error) {
    console.error(`Classification error for ${path.basename(imagePath)}:`, error.message);
    return { label: 'unclassified_processing_error', confidence: 0.0 };
  }
}

// Ensure model is loaded on service startup
loadModel(); 

export { classifyImage };
