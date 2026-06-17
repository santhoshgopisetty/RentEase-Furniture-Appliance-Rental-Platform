import express from 'express';
import {
  getDashboardAnalytics,
  getAdminUsers,
  getAdminOrders,
  updateAdminOrderStatus
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(admin); // All admin routes require protect + admin verification

router.get('/dashboard', getDashboardAnalytics);
router.get('/users', getAdminUsers);
router.get('/orders', getAdminOrders);
router.put('/orders/:id', updateAdminOrderStatus);

export default router;
