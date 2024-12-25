import express from "express";
import { placeOrder, getOrders, getOrderById } from "../../controllers/customer/orderController";
import { protect } from "../../middlewares/authMiddleware";


const router = express.Router();


// Place order
router.post('/', protect, placeOrder);


// Getting all orders of logged in customer
router.get('/', protect, getOrders);


// Getting an order of customer by id
router.get('/:id', protect, getOrderById);



export default router;