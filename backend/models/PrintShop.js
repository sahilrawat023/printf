import mongoose from 'mongoose';

const printShopSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  services: [{ type: String, enum: ['color', 'bw', 'lamination', 'spiral-binding'] }],
  pricing: {
    color: { type: Number },
    bw: { type: Number },
    lamination: { type: Number },
    spiral: { type: Number }
  },
  logoUrl: { type: String },
  autoLocationEnabled: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

printShopSchema.index({ location: '2dsphere' });

const PrintShop = mongoose.model('PrintShop', printShopSchema);
export default PrintShop;
