import mongoose from "mongoose";

const printShopSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true }, // [lng, lat]
    },
    services: [{ type: String, required: true }],
    pricing: {
      color: { type: Number, required: true },
      bw: { type: Number, required: true },
      lamination: { type: Number, required: true },
    },
    logoUrl: { type: String },
  },
  { timestamps: true }
);

printShopSchema.index({ location: "2dsphere" });

export default mongoose.model("PrintShop", printShopSchema);
