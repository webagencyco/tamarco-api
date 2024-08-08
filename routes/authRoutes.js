import { Router } from 'express';
import { register, login, changePassword, updateUserAddress } from '../controllers/authController.js';
import { validateRegistration } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.post('/change-password',authenticate, changePassword);
router.put('/update-address',authenticate, updateUserAddress);

export default router;