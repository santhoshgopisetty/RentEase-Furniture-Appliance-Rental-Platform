import express from 'express';
import { createRentalOrder, getRentals, extendRental } from '../controllers/rentalController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // protect all rental routes

router.route('/')
  .post(createRentalOrder)
  .get(getRentals);

router.put('/extend', extendRental);

export default router;
