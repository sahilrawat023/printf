import mongoose from 'mongoose';

const printOrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'PrintShop', required: true },
  documentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  services: [{ type: String, enum: ['color', 'bw', 'lamination', 'spiral-binding'] }],
  quantity: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled', 'rejected'], default: 'pending' }
}, { timestamps: true });

const PrintOrder = mongoose.model('PrintOrder', printOrderSchema);
export default PrintOrder;
