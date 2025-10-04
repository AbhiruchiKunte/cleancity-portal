// services/embeddingService.js
import * as tf from "@tensorflow/tfjs-node";
import * as resnet from "@tensorflow-models/resnet";
import fs from "fs";

let model;

/**
 * Loads ResNet model (singleton)
 */
export const loadModel = async () => {
  if (!model) {
    model = await resnet.load();
    console.log("✅ ResNet50 model loaded.");
  }
  return model;
};

/**
 * Extracts image embedding from the given image path
 */
export const getImageEmbedding = async (imagePath) => {
  try {
    const buffer = fs.readFileSync(imagePath);
    const imageTensor = tf.node.decodeImage(buffer, 3).resizeNearestNeighbor([224, 224]).expandDims(0);
    const loadedModel = await loadModel();
    const embedding = loadedModel.infer(imageTensor, true);
    const embeddingArray = Array.from(embedding.dataSync());

    tf.dispose([imageTensor, embedding]);
    return embeddingArray;
  } catch (error) {
    console.error("❌ Error generating embedding:", error);
    return null;
  }
};

/**
 * Compute cosine similarity between two embeddings
 */
export const cosineSimilarity = (a, b) => {
  const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
  const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
  return dot / (magA * magB);
};
