import { Router } from 'express';
import { processPayment, getInvoices } from '../controllers/paymentController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { purchaseNumber } from '../services/tamarApi.js';

const router = Router();

router.post('/', authenticate, processPayment);
router.get('/invoices', authenticate, getInvoices);
router.get('/test', authenticate, purchaseNumber);

export default router;
