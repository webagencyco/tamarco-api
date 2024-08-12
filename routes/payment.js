import { Router } from 'express';
import { processPayment, getInvoices } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/', authenticate, processPayment);
router.get('/invoices', authenticate, getInvoices);

export default router;
