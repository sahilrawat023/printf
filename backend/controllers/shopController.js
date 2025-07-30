import PrintShop from '../models/PrintShop.js';
import User from '../models/User.js';

// Create a new print shop
export const createShop = async (req, res) => {
  try {
    const { name, address, location, services, pricing, logoUrl, autoLocationEnabled } = req.body;
    const shop = await PrintShop.create({
      ownerId: req.user._id,
      name,
      address,
      location,
      services,
      pricing,
      logoUrl,
      autoLocationEnabled
    });
    res.status(201).json(shop);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create shop', details: err.message });
  }
};

// Update shop (only by owner or admin)
export const updateShop = async (req, res) => {
  try {
    const shop = await PrintShop.findById(req.params.id);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    if (shop.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    Object.assign(shop, req.body);
    await shop.save();
    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update shop', details: err.message });
  }
};

// Get nearby shops
export const getNearbyShops = async (req, res) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ error: 'lat and lng required' });
    const shops = await PrintShop.find({
      isActive: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [parseFloat(lng), parseFloat(lat)] },
          $maxDistance: 10000 // 10km
        }
      }
    }).limit(10);
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch shops', details: err.message });
  }
}; 

export const getMyShop = async (req, res) => {
  try {
    const shop = await PrintShop.findOne({ ownerId: req.user._id });

    if (!shop) {
      return res.status(404).json({ message: 'Shop not found for this user' });
    }

    res.status(200).json(shop);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
