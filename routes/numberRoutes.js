import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
import { validateNumberPurchase } from '../middleware/validate.js';
import {
  getNumbers,
  searchNumbers,
  initiateNumberPurchase,
  completeNumberPurchase,
  updateNumberDestination,
  cancelNumber,
} from '../controllers/numberController.js';

const router = express.Router();

router.get('/', authenticate, getNumbers);
router.get('/search', searchNumbers);
router.post('/purchase/initiate', authenticate, validateNumberPurchase, initiateNumberPurchase);
router.post('/purchase/complete', authenticate, validateNumberPurchase, completeNumberPurchase);
router.put('/:numberId/destination', authenticate, updateNumberDestination);
router.delete('/:numberId', authenticate, cancelNumber);

export default router;