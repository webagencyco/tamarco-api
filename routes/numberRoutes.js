import { Router } from 'express';
import { getNumbers } from '../controllers/numberController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', authenticate, getNumbers);

export default router;
