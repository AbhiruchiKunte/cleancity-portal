import fetch from 'node-fetch';
import fs from 'fs';
import FormData from 'form-data';  // make sure to install this package

// Function to get embedding from Python microservice
export async function getEmbeddingFromPython(filePath) {
  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath));

    const res = await fetch('http://127.0.0.1:8000/embed', {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
    });

    if (!res.ok) throw new Error(`Embed service failed: ${res.statusText}`);

    const json = await res.json();
    return json.embedding; // array of floats (already normalized)
  } catch (err) {
    console.error("❌ Error fetching embedding:", err.message);
    throw err;
  }
}
