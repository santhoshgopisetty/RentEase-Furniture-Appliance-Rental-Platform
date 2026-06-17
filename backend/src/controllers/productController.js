import Product from '../models/Product.js';

// @desc    Get all products (with optional filter/search)
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const { category, search, availability, sort } = req.query;
    let query = {};

    // Filter by Category
    if (category) {
      query.category = category;
    }

    // Search term in name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Availability filter
    if (availability) {
      query.availability = availability === 'true';
    }

    let apiQuery = Product.find(query);

    // Sorting options
    if (sort) {
      if (sort === 'rent-asc') {
        apiQuery = apiQuery.sort({ monthlyRent: 1 });
      } else if (sort === 'rent-desc') {
        apiQuery = apiQuery.sort({ monthlyRent: -1 });
      } else if (sort === 'newest') {
        apiQuery = apiQuery.sort({ createdAt: -1 });
      }
    } else {
      apiQuery = apiQuery.sort({ createdAt: -1 }); // default newest
    }

    const products = await apiQuery;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  const { name, description, category, image, monthlyRent, securityDeposit, tenureOptions, stock, availability } = req.body;

  try {
    const product = await Product.create({
      name,
      description,
      category,
      image,
      monthlyRent,
      securityDeposit,
      tenureOptions: tenureOptions || [3, 6, 9, 12],
      stock: stock === undefined ? 10 : stock,
      availability: availability === undefined ? true : availability
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  const { name, description, category, image, monthlyRent, securityDeposit, tenureOptions, stock, availability } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.category = category || product.category;
      product.image = image || product.image;
      product.monthlyRent = monthlyRent !== undefined ? monthlyRent : product.monthlyRent;
      product.securityDeposit = securityDeposit !== undefined ? securityDeposit : product.securityDeposit;
      product.tenureOptions = tenureOptions || product.tenureOptions;
      product.stock = stock !== undefined ? stock : product.stock;
      product.availability = availability !== undefined ? availability : product.availability;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: req.params.id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
