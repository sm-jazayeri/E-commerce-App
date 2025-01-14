import express from "express";
import { getAllOrders, getOrderById, updateOrderStatus } from "../../controllers/admin/adminOrderController";
import { protect, authorizedRoles } from "../../middlewares/authMiddleware";


const router = express.Router();


// Get all orders - Admin
router.get('/', protect, authorizedRoles("ADMIN"), getAllOrders);


// Get an order by ID - Admin
router.get('/:id', protect, authorizedRoles("ADMIN"), getOrderById);


// Update order status - Admin
router.put('/:id/status', protect, authorizedRoles("ADMIN"), updateOrderStatus);



export default router;