import express from 'express';
import { validateCreateCustomer } from '../middlewares/validators';
import {
    handleSignup,
    verifyEmail,
} from '../controllers/customerController';

const router = express.Router();

router.post('/signup',validateCreateCustomer,handleSignup);
router.get('/verify-email', verifyEmail);

export default router;