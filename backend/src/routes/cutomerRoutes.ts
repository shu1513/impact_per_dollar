import express from 'express';
import { validateCreateCustomer } from '../middlewares/validators';
import {
    handleSignup,
    verifyEmail,
} from '../controllers/customerController';

const router = express.Router();

router.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
  });

router.post('/signup',validateCreateCustomer,handleSignup);
router.get('/verify-email', verifyEmail);

export default router;