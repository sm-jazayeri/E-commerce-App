import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productController";
import { protect, authorizedRoles } from "../middlewares/authMiddleware";



const router = express.Router();



// Create product
router.post('/', protect, authorizedRoles('ADMIN'), createProduct);


// Get all products
router.get('/', getAllProducts);


// Get a product by id
router.get('/:id', getProductById)


// Update a product
router.put('/:id', protect, authorizedRoles('ADMIN'), updateProduct);


// Delete a product
router.delete('/:id', protect, authorizedRoles('ADMIN'), deleteProduct);




export default router;