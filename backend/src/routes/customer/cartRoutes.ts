import express from "express";
import { protect } from "../../middlewares/authMiddleware";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../../controllers/customer/cartController";
import validateRequest from "../../middlewares/validateRequest";
import { createCartSchema, updateCartSchema } from "../../validators/cartSchema";


const router = express.Router();
router.use(protect); // All routes require authentication


// Add item to cart
router.post('/add', validateRequest(createCartSchema), addToCart);


// Get cart items
router.get('/', getCart);


// Update cart item
router.put('/update/:itemId', validateRequest(updateCartSchema), updateCartItem);


// Remove cart item
router.delete('/remove/:itemId', removeCartItem);


// Clear cart
router.delete('/clear', clearCart);




export default router;