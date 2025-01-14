import express from "express";
import {createPayment, verifyPayment} from "../../controllers/customer/paymentController";


const router = express.Router();



// Create payment request
router.post('/create', createPayment);

// Create payment request
router.post('/verify', verifyPayment); 





export default router;