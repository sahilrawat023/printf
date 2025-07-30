import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  fileUrl: { type: String, required: true },
  fileName: { type: String, required: true },
  printPreferences: {
    copies: { type: Number, default: 1 },
    color: { type: Boolean, default: true },
    doubleSided: { type: Boolean, default: false }
  }
}, { timestamps: true });

const Document = mongoose.model('Document', documentSchema);
export default Document;
