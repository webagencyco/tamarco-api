import { Router } from 'express';
import { processPayment } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticate, processPayment);

export default router;
