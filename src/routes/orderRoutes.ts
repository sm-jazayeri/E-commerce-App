import express from "express";
import { placeOrder, getAllOrders, getOrderById, updateOrderStatus } from "../controllers/orderController";
import { protect, authorizedRoles } from "../middlewares/authMiddleware";


const router = express.Router();


// Place order
router.post('/', protect, placeOrder)


// Get all orders - Admin
router.get('/', protect, authorizedRoles("ADMIN"), getAllOrders);


// Get an order by ID - Admin
router.get('/:id', protect, authorizedRoles("ADMIN"), getOrderById);


// Update order status
router.put('/:id/status', protect, authorizedRoles("ADMIN"), updateOrderStatus);



export default router;