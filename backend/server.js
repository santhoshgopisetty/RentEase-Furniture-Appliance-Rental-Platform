import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './src/config/db.js';

// Load routes
import authRoutes from './src/routes/authRoutes.js';
import productRoutes from './src/routes/productRoutes.js';
import cartRoutes from './src/routes/cartRoutes.js';
import rentalRoutes from './src/routes/rentalRoutes.js';
import maintenanceRoutes from './src/routes/maintenanceRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';

// Load middleware
import { notFound, errorHandler } from './src/middleware/errorMiddleware.js';

// Configuration
dotenv.config();

// Connect Database
connectDB();

const app = express();

// Enable CORS
app.use(cors({
  origin: '*', // Allow all origins for dev/production simplicity, or adjust for security
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser
app.use(express.json());

// Base check route
app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'RentEase API is running' });
});

// Map routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
