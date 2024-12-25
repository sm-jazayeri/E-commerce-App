import express from "express";
import { placeOrder } from "../../controllers/customer/orderController";
import { protect, authorizedRoles } from "../../middlewares/authMiddleware";


const router = express.Router();


// Place order
router.post('/', protect, placeOrder)




export default router;