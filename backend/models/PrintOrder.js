import mongoose from "mongoose";

const printOrderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PrintShop",
      required: true,
    },
    documentIds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Document", required: true },
    ],
    services: [{ type: String, required: true }],
    quantity: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("PrintOrder", printOrderSchema);
