import express from 'express';
import {
  createMaintenanceRequest,
  getMaintenanceRequests,
  updateMaintenanceRequest
} from '../controllers/maintenanceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // protect all maintenance routes

router.route('/')
  .post(createMaintenanceRequest)
  .get(getMaintenanceRequests);

router.route('/:id')
  .put(updateMaintenanceRequest);

export default router;
