import Document from '../models/Document.js';
import cloudinary from '../config/cloudinary.js';

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const upload = await cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
      if (error) throw error;
      const doc = new Document({
        userId: req.user._id,
        fileUrl: result.secure_url,
        fileName: req.file.originalname,
      });
      doc.save();
      res.status(201).json({ document: doc });
    });
    upload.end(req.file.buffer);
  } catch (err) {
    res.status(400).json({ error: 'Failed to upload document' });
  }
};

export const getUserDocuments = async (req, res) => {
  const docs = await Document.find({ userId: req.user._id });
  res.json({ documents: docs });
};

export const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    await cloudinary.uploader.destroy(doc.fileUrl);
    await doc.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete document' });
  }
}; 