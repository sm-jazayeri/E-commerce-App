import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
} from "../controllers/productController";
import { protect, authorizedRoles } from "../middlewares/authMiddleware";
import { upload } from "../utils/upload";



const router = express.Router();



// Get all products
router.get('/', getAllProducts);


// Get a product by id
router.get('/:id', getProductById)


// Create product
router.post('/', protect, authorizedRoles('ADMIN'), upload.single('image'), createProduct);


// Update a product
router.put('/:id', protect, authorizedRoles('ADMIN'), upload.single('image'), updateProduct);


// Delete a product
router.delete('/:id', protect, authorizedRoles('ADMIN'), deleteProduct);




export default router;