import Document from '../models/Document.js';

// Upload document and save to DB
export const uploadDocument = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { shopId, printPreferences } = req.body;

    const document = await Document.create({
      userId: req.user._id,
      shopId,
      printPreferences: printPreferences ? JSON.parse(printPreferences) : undefined,
      fileUrl: req.file.path,
      fileName: req.file.originalname
    });

    res.status(201).json(document);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload document', details: err.message });
  }
};
