import RentalOrder from '../models/RentalOrder.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';

// @desc    Create rental orders from cart (checkout)
// @route   POST /api/rentals
// @access  Private
export const createRentalOrder = async (req, res) => {
  const { deliveryDate } = req.body;

  if (!deliveryDate) {
    return res.status(400).json({ message: 'Please select a delivery date' });
  }

  try {
    // 1. Fetch user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('products.product');

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const createdOrders = [];

    // 2. Loop through cart products and create rental orders
    for (const item of cart.products) {
      const product = item.product;

      if (!product) {
        return res.status(404).json({ message: 'One or more products in your cart no longer exist' });
      }

      // Check stock
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, requested: ${item.quantity}`
        });
      }

      // Calculate rent and security deposit
      const rentAmount = product.monthlyRent * item.quantity;
      const securityDeposit = product.securityDeposit * item.quantity;

      // Calculate return date
      const delivery = new Date(deliveryDate);
      const returnDate = new Date(delivery);
      returnDate.setMonth(returnDate.getMonth() + item.selectedTenure);

      // Create the rental order
      const rentalOrder = new RentalOrder({
        user: req.user._id,
        product: product._id,
        quantity: item.quantity,
        selectedTenure: item.selectedTenure,
        rentAmount,
        securityDeposit,
        deliveryDate: delivery,
        returnDate,
        status: 'Pending' // Starts as Pending
      });

      await rentalOrder.save();

      // Decrement product stock
      product.stock -= item.quantity;
      if (product.stock === 0) {
        product.availability = false;
      }
      await product.save();

      createdOrders.push(rentalOrder);
    }

    // 3. Clear cart
    cart.products = [];
    await cart.save();

    res.status(201).json({
      message: 'Rental orders created successfully',
      orders: createdOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's rentals
// @route   GET /api/rentals
// @access  Private
export const getRentals = async (req, res) => {
  try {
    const rentals = await RentalOrder.find({ user: req.user._id })
      .populate('product')
      .sort({ createdAt: -1 });
    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Extend rental tenure duration
// @route   PUT /api/rentals/extend
// @access  Private
export const extendRental = async (req, res) => {
  const { orderId, extensionMonths } = req.body;

  if (!orderId || !extensionMonths) {
    return res.status(400).json({ message: 'Order ID and extension months are required' });
  }

  try {
    const order = await RentalOrder.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: 'Rental order not found' });
    }

    if (order.status !== 'Active') {
      return res.status(400).json({ message: 'Only active rentals can be extended' });
    }

    // Extend return date
    const currentReturnDate = new Date(order.returnDate);
    currentReturnDate.setMonth(currentReturnDate.getMonth() + Number(extensionMonths));
    order.returnDate = currentReturnDate;

    // Update selected tenure
    order.selectedTenure += Number(extensionMonths);

    await order.save();
    res.json({
      message: 'Rental tenure extended successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
