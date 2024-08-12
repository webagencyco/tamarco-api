import { Router } from 'express';
import { register, login, changePassword, updateUserAddress, getUser, verifyEmail } from '../controllers/authController.js';
import { validateRegistration } from '../middleware/validate.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.post('/change-password',authenticate, changePassword);
router.put('/update-address',authenticate, updateUserAddress);
router.get('/user-details',authenticate, getUser)
router.get('/verify-email/:token', verifyEmail);


export default router;