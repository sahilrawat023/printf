import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileUrl: { type: String, required: true },
    fileName: { type: String, required: true },
  },
  { timestamps: { createdAt: "uploadedAt", updatedAt: false } }
);

export default mongoose.model("Document", documentSchema);
