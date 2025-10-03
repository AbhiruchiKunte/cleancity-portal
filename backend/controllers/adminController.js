import Record from '../models/Record.js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
dotenv.config();
const OPENAI_MODEL = process.env.OPENAI_MODEL;
const OPENAI_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS);
const OPENAI_TEMPERATURE = parseFloat(process.env.OPENAI_TEMPERATURE);

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
 * POST /api/validate/:id: Validates a record. (Module B6)
 */
const validateRecord = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Invalid action. Use "approve" or "reject".' });
    }

    const update = {
      validationStatus: action === 'approve' ? 'approved' : 'rejected',
validatedAt: new Date(),
validatedBy: req.admin || 'admin',
validated: action === 'approve'
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
const getPendingRecords = async (req, res) => {
  try {
    const records = await Record.find({ validationStatus: 'pending' }).sort({ timestamp: -1 }).limit(500);
    res.json(records);
  } catch (error) {
    console.error('Error fetching pending records:', error);
    res.status(500).json({ message: 'Error fetching pending records' });
  }
};

/**
 * GET /api/export: Exports all validated records as CSV. (Module B6)
 */
const exportRecords = async (req, res) => {
  try {
    const records = await Record.find({ validated: true }).sort({ timestamp: 1 });
    
    if (records.length === 0) {
        return res.status(404).json({ message: 'No validated records to export.' });
    }

    // 1. Define CSV Header
    const headers = ['id', 'userId', 'label', 'confidence', 'lat', 'lng', 'image_url', 'timestamp', 'validated'];
    let csv = headers.join(',') + '\n';

    // 2. Generate CSV Rows
    records.forEach(record => {
      const row = [
        record._id.toString(),
        `"${record.userId}"`,
        `"${record.label}"`,
        record.confidence,
        record.lat,
        record.lng,
        `"${record.image_url}"`,
        record.timestamp.toISOString(),
        record.validated
      ];
      csv += row.join(',') + '\n';
    });

    // 3. Set headers for file download
    res.header('Content-Type', 'text/csv');
    res.attachment('cleancity_export.csv');
    res.send(csv);

  } catch (error) {
    console.error('Error exporting records:', error);
    res.status(500).json({ message: 'Error generating CSV export' });
  }
};

/**
 * POST /api/admin/report - generate a textual report using OpenAI
 */
const generateReport = async (req, res) => {
  try {
    const { from, to, summaryOnly } = req.body || {};

    const query = { validated: true };
    if (from || to) query.timestamp = {};
    if (from) query.timestamp.$gte = new Date(from);
    if (to) query.timestamp.$lte = new Date(to);

    const records = await Record.find(query).limit(1000);

    // Prepare a compact summary for AI
    const shortRecords = records.map(r => ({
      id: r._id.toString(),
      label: r.label,
      confidence: r.confidence,
      lat: r.lat,
      lng: r.lng,
      timestamp: r.timestamp,
      validationStatus: r.validationStatus || (r.validated ? 'approved' : 'pending')
    }));

    // If OpenAI key not configured, return data-only fallback
    const openaiKey = process.env.OPENAI_API_KEY;
    if (!openaiKey) {
      return res.json({ message: 'No OPENAI_API_KEY configured. Returning raw data.', records: shortRecords });
    }

    // Basic prompt to generate a report
    const prompt = `Generate a concise report for ${shortRecords.length} validated records. ` +
      `Provide top 5 labels, average confidence, and top 5 hotspots (lat,lng) with counts. ` +
      `Return as JSON with keys: summary, topLabels, avgConfidence, topHotspots.`;

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openaiKey}`
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        messages: [
          { role: 'system', content: 'You are a helpful data summarizer.' },
          { role: 'user', content: prompt + '\n\nRecords: ' + JSON.stringify(shortRecords) }
        ],
        max_tokens: OPENAI_MAX_TOKENS,
        temperature: OPENAI_TEMPERATURE
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      console.error('OpenAI error:', errText);
      return res.status(502).json({ message: 'OpenAI API error', details: errText });
    }

    const json = await resp.json();
    const aiText = json.choices?.[0]?.message?.content || '';

    // Return AI text along with raw data
    res.json({ report: aiText, records: shortRecords });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report', error: error.message });
  }
};

export { validateRecord, exportRecords, loginAdmin, getPendingRecords, generateReport };

/**
 * GET /api/admin/debug-stats - Safe debug endpoint (unprotected)
 * Returns counts for pending and validated records and a few sample documents (no secrets)
 */
const debugStats = async (req, res) => {
  try {
    const pendingCount = await Record.countDocuments({ validationStatus: 'pending' });
    const validatedCount = await Record.countDocuments({ validated: true });

    const samplePending = await Record.find({ validationStatus: 'pending' }).limit(5).select('label confidence lat lng timestamp validationStatus image_url');
    const sampleValidated = await Record.find({ validated: true }).limit(5).select('label confidence lat lng timestamp validationStatus image_url');

    res.json({ pendingCount, validatedCount, samplePending, sampleValidated });
  } catch (error) {
    console.error('Error in debugStats:', error);
    res.status(500).json({ message: 'Error fetching debug stats' });
  }
};

export { debugStats };
