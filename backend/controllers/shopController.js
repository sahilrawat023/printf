import PrintShop from '../models/PrintShop.js';
import cloudinary from '../config/cloudinary.js';

export const registerShop = async (req, res) => {
  try {
    const { name, address, coordinates, services, pricing } = req.body;
    let logoUrl = '';
    if (req.file) {
      const upload = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) throw error;
        logoUrl = result.secure_url;
      });
      upload.end(req.file.buffer);
    }
    const shop = new PrintShop({
      ownerId: req.user._id,
      name,
      address,
      location: { type: 'Point', coordinates },
      services,
      pricing,
      logoUrl,
    });
    await shop.save();
    res.status(201).json({ shop });
  } catch (err) {
    res.status(400).json({ error: 'Failed to register shop' });
  }
};

export const updateShop = async (req, res) => {
  try {
    const { name, address, coordinates, services, pricing } = req.body;
    const shop = await PrintShop.findOne({ ownerId: req.user._id });
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    if (name) shop.name = name;
    if (address) shop.address = address;
    if (coordinates) shop.location.coordinates = coordinates;
    if (services) shop.services = services;
    if (pricing) shop.pricing = pricing;
    if (req.file) {
      const upload = await cloudinary.uploader.upload_stream({ resource_type: 'image' }, (error, result) => {
        if (error) throw error;
        shop.logoUrl = result.secure_url;
      });
      upload.end(req.file.buffer);
    }
    await shop.save();
    res.json({ shop });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update shop' });
  }
};

export const getMyShop = async (req, res) => {
  const shop = await PrintShop.findOne({ ownerId: req.user._id });
  if (!shop) return res.status(404).json({ error: 'Shop not found' });
  res.json({ shop });
};

export const getNearbyShops = async (req, res) => {
  try {
    const { lng, lat, maxDistance = 5000 } = req.query;
    const shops = await PrintShop.find({
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: parseInt(maxDistance),
        },
      },
    });
    res.json({ shops });
  } catch (err) {
    res.status(400).json({ error: 'Failed to find nearby shops' });
  }
}; 