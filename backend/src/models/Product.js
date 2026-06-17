import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a product description']
  },
  category: {
    type: String,
    required: [true, 'Please add a category'],
    enum: [
      'Bed', 'Sofa', 'Table', 'Chair', 'Wardrobe',
      'Refrigerator', 'Washing Machine', 'Television', 'Microwave', 'Air Conditioner'
    ]
  },
  image: {
    type: String,
    required: [true, 'Please add an image URL']
  },
  monthlyRent: {
    type: Number,
    required: [true, 'Please add the monthly rent amount']
  },
  securityDeposit: {
    type: Number,
    required: [true, 'Please add the security deposit amount']
  },
  tenureOptions: {
    type: [Number],
    default: [3, 6, 9, 12] // Options in months
  },
  stock: {
    type: Number,
    required: [true, 'Please add the inventory stock count'],
    default: 10
  },
  availability: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
