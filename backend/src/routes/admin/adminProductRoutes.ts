import express from "express";
import {
    createProduct,
    updateProduct,
    deleteProduct
} from "../../controllers/admin/adminProductController";
import { protect, authorizedRoles } from "../../middlewares/authMiddleware";
import { upload } from "../../utils/upload";



const router = express.Router();



// Create product
router.post('/', protect, authorizedRoles('ADMIN'), upload.single('image'), createProduct);


// Update a product
router.put('/:id', protect, authorizedRoles('ADMIN'), upload.single('image'), updateProduct);


// Delete a product
router.delete('/:id', protect, authorizedRoles('ADMIN'), deleteProduct);




export default router;