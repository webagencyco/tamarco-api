import { Router } from 'express';
import { register, login, changePassword, updateUserAddress } from '../controllers/authController.js';
import { validateRegistration } from '../middleware/validate.js';

const router = Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.post('/change-password', changePassword);
router.put('/update-address', updateUserAddress);

export default router;