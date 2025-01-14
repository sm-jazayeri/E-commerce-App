import express from "express";
import {
    getAllProducts,
    getProductById,
} from "../../controllers/customer/productController";



const router = express.Router();



// Get all products
router.get('/', getAllProducts);


// Get a product by id
router.get('/:id', getProductById)



export default router;