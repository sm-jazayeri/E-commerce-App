import express from "express";
import { protect } from "../middlewares/authMiddleware";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart
} from "../controllers/cartController";


const router = express.Router();
router.use(protect); // All routes require authentication


// Add item to cart
router.post('/add', addToCart);


// Get cart items
router.get('/', getCart);


// Update cart item
router.put('/update/:itemId', updateCartItem);


// Remove cart item
router.delete('/remove/:itemId', removeCartItem);


// Clear cart
router.delete('/clear', clearCart);




export default router;