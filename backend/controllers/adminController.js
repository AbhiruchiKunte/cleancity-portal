import Record from '../models/Record.js';
import dotenv from 'dotenv';
dotenv.config();

/**
 * POST /api/admin/login - Authenticate admin with password only
 */
const loginAdmin = (req, res) => {
  const { password } = req.body;

  if (password === process.env.ADMIN_PASSWORD) {
    return res.json({ success: true, message: 'Login successful' });
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
    
    // Use findByIdAndUpdate to atomic set the validated flag
    const record = await Record.findByIdAndUpdate(
      id,
      { validated: true },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!record) {
      return res.status(404).json({ message: 'Record not found.' });
    }

    res.json({ message: 'Record validated successfully', record });
  } catch (error) {
    console.error('Error validating record:', error);
    res.status(500).json({ message: 'Error validating record', error: error.message });
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

export { validateRecord, exportRecords, loginAdmin };
