import express from "express";
import {createPayment, verifyPayment} from "../../controllers/customer/paymentController";
import {protect} from "../../middlewares/authMiddleware"


const router = express.Router();



// Create payment request
router.post('/create', protect, createPayment);

// Create payment request
router.post('/verify', verifyPayment); 





export default router;