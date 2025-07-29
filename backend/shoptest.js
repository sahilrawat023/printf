import express from "express";
import mongoose from "mongoose";
import shopkeeper from "../backend/models/PrintShop.js"; // add .js if needed for ES modules
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI;
const app = express();
app.use(express.json());

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");

    // Start server only after DB connection succeeds
    const PORT = 3000;
    app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

// Create Shopkeeper
app.post("/shopkeepers", async (req, res) => {
  try {
    const shopkeeper = new Shopkeeper(req.body);
    const saved = await shopkeeper.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message, details: err.errors });
  }
});

// Get all Shopkeepers
app.get("/shopkeepers", async (req, res) => {
  const shopkeepers = await Shopkeeper.find();
  res.json(shopkeepers);
});

// Get Shopkeeper by ID
app.get("/shopkeepers/:id", async (req, res) => {
  try {
    const shopkeeper = await Shopkeeper.findById(req.params.id);
    if (!shopkeeper)
      return res.status(404).json({ error: "Shopkeeper not found" });
    res.json(shopkeeper);
  } catch (err) {
    res.status(400).json({ error: "Invalid shopkeeper ID" });
  }
});

// Update Shopkeeper
app.put("/shopkeepers/:id", async (req, res) => {
  try {
    const updated = await Shopkeeper.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updated)
      return res.status(404).json({ error: "Shopkeeper not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message, details: err.errors });
  }
});

// Delete Shopkeeper
app.delete("/shopkeepers/:id", async (req, res) => {
  try {
    const deleted = await Shopkeeper.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ error: "Shopkeeper not found" });
    res.json({ message: "Shopkeeper deleted" });
  } catch (err) {
    res.status(400).json({ error: "Invalid shopkeeper ID" });
  }
});
