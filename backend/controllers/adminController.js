import Record from '../models/Record.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

/**
 * POST /api/admin/login - Authenticate admin with password only
 */
const loginAdmin = (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    const adminToken = process.env.ADMIN_TOKEN || null;
    return res.json({ success: true, message: 'Login successful', token: adminToken });
  }

  return res.status(401).json({
    success: false,
    message: 'Incorrect admin details. Please try again.',
  });
};

/**
 * POST /api/validate/:id: Validates a record.
 */
const validateRecord = async (req, res) => {
  // ... (this function is correct, no changes needed)
  try {
    const { id } = req.params;
    const { action, notes } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject".' });
    }

    const update = {
      validationStatus: action === 'approve' ? 'approved' : 'rejected',
<<<<<<< HEAD
validatedAt: new Date(),
validatedBy: req.admin || 'admin',
validated: action === 'approve'
=======
      validationNotes: notes || '',
      validatedAt: new Date(),
      validatedBy: req.admin || 'admin',
      validated: action === 'approve'
>>>>>>> 4f852f646e721405811d6b2eafc8d79d7b26a2a1
    };

    const record = await Record.findByIdAndUpdate(id, update, { new: true, runValidators: true });

    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    res.json({ message: `Record ${action}d successfully`, record });
  } catch (error) {
    console.error('Error validating record:', error);
    res.status(500).json({ message: 'Error validating record', error: error.message });
  }
};

/**
 * GET /api/admin/pending - list pending records awaiting validation
 */
const listPendingRecords = async (req, res) => {
  // ... (this function is correct, no changes needed)
  try {
    const pendingRecords = await Record.find({ validationStatus: 'pending' }).sort({ timestamp: -1 });
    res.json(pendingRecords);
  } catch (error)
  {
    console.error('Error fetching pending records:', error);
    res.status(500).json({ message: 'Error fetching pending records', error: error.message });
  }
};

/**
 * POST /api/admin/report - Generates a report using Gemini AI
 */
const generateReport = async (req, res) => {
  try {
    const { from, to } = req.body || {};
    const query = { validated: true };
    if (from || to) query.timestamp = {};
    if (from) query.timestamp.$gte = new Date(from);
    if (to) query.timestamp.$lte = new Date(to);

    const records = await Record.find(query).limit(1000);

    const shortRecords = records.map(r => ({
      id: r._id.toString(),
      label: r.label,
      confidence: r.confidence,
      lat: r.lat,
      lng: r.lng,
      timestamp: r.timestamp,
      validationStatus: r.validationStatus || (r.validated ? 'approved' : 'pending')
    }));

    // --- Start of Gemini API Integration ---

    // 1. Set the Gemini API key from .env file and set the endpoint
    const geminiApiKey = process.env.GEMINI_API_KEY; // <-- THIS IS THE FIX
    const geminiApiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`;

    // 2. Combine system and user prompts for Gemini
    const prompt = `You are a helpful data summarizer...`; // (prompt is correct, shortened for brevity)

    // 3. Make the fetch request to the Gemini API
    const resp = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!resp.ok) {
      const errorDetails = await resp.json();
      console.error('Gemini API error:', errorDetails);
      return res.status(502).json({ message: 'Gemini API error', details: errorDetails });
    }

    const json = await resp.json();
    const aiText = json.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // --- End of Gemini API Integration ---

    res.json({ report: aiText, records: shortRecords });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

export { loginAdmin, validateRecord, listPendingRecords, generateReport };