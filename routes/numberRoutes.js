import express from 'express';
import { authenticate } from '../middleware/authMiddleware.js';
// import { validateNumberPurchase } from '../middleware/validate.js';
import {
  createNumber,
  getNumbers,
  // searchNumbers,
  // initiateNumberPurchase,
  // completeNumberPurchase,
  updateNumberDestination,
  cancelNumber,
  addNumberUsage,
  getNumberUsage,
  getApiNumber,
  getTariffs
} from '../controllers/numberController.js';
import { tariffPrices } from '../services/tamarApi.js';

const router = express.Router();

router.post('/', authenticate, createNumber);
router.get('/',authenticate, getNumbers);
router.get('/api',authenticate, getApiNumber);
router.get('/tariffs',authenticate, getTariffs);
router.get('/tariffs/prices',authenticate, tariffPrices);
// router.get('/search', searchNumbers);
// router.post('/purchase/initiate', authenticate, validateNumberPurchase, initiateNumberPurchase);
// router.post('/purchase/complete', authenticate, validateNumberPurchase, completeNumberPurchase);
router.put('/:numberId', authenticate, updateNumberDestination);
router.delete('/:numberId', authenticate, cancelNumber);
router.post('/:numberId/usage', authenticate, addNumberUsage);
router.get('/:numberId/usage', authenticate, getNumberUsage);

export default router;