import Cart from '../models/Cart.js';

// @desc    Get current user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate('products.product');

    if (!cart) {
      // Create cart if not exists
      cart = await Cart.create({ user: req.user._id, products: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  const { productId, quantity, selectedTenure } = req.body;

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, products: [] });
    }

    // Check if product with the same tenure already exists in cart
    const itemIndex = cart.products.findIndex(
      (p) => p.product.toString() === productId && p.selectedTenure === Number(selectedTenure)
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.products[itemIndex].quantity += Number(quantity);
    } else {
      // Add new item
      cart.products.push({
        product: productId,
        quantity: Number(quantity),
        selectedTenure: Number(selectedTenure)
      });
    }

    cart.updatedAt = Date.now();
    await cart.save();

    // Populate and return updated cart
    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/remove
// @access  Private
export const removeFromCart = async (req, res) => {
  const { productId, selectedTenure } = req.body; // or read from query params

  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the product matching both productId and selectedTenure
    cart.products = cart.products.filter(
      (p) => !(p.product.toString() === productId && p.selectedTenure === Number(selectedTenure))
    );

    cart.updatedAt = Date.now();
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate('products.product');
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
