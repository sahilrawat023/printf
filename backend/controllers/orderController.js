import PrintOrder from '../models/PrintOrder.js';
import PrintShop from '../models/PrintShop.js';

export const placeOrder = async (req, res) => {
  try {
    const { shopId, documentIds, services, quantity, totalCost } = req.body;
    const shop = await PrintShop.findById(shopId);
    if (!shop) return res.status(404).json({ error: 'Shop not found' });
    const order = new PrintOrder({
      userId: req.user._id,
      shopId,
      documentIds,
      services,
      quantity,
      totalCost,
    });
    await order.save();
    res.status(201).json({ order });
  } catch (err) {
    res.status(400).json({ error: 'Failed to place order' });
  }
};

export const getUserOrders = async (req, res) => {
  const orders = await PrintOrder.find({ userId: req.user._id }).populate('shopId').populate('documentIds');
  res.json({ orders });
};

export const getShopOrders = async (req, res) => {
  const shop = await PrintShop.findOne({ ownerId: req.user._id });
  if (!shop) return res.status(404).json({ error: 'Shop not found' });
  const orders = await PrintOrder.find({ shopId: shop._id }).populate('userId').populate('documentIds');
  res.json({ orders });
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await PrintOrder.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const shop = await PrintShop.findOne({ ownerId: req.user._id });
    if (!shop || !order.shopId.equals(shop._id)) return res.status(403).json({ error: 'Forbidden' });
    order.status = status;
    await order.save();
    res.json({ order });
  } catch (err) {
    res.status(400).json({ error: 'Failed to update order status' });
  }
}; 