import express from "express";
import {protect, authorizedRoles} from "../../middlewares/authMiddleware";
import { 
    getAllCoupon,
    createCoupon, 
    updateCoupon, 
    deleteCoupon } from "../../controllers/admin/adminCouponController";


const router = express.Router();


// Get all coupons
router.get('/', protect, authorizedRoles('ADMIN'), getAllCoupon);

// Create a coupon
router.post('/', protect, authorizedRoles('ADMIN'), createCoupon);

// Update a coupon
router.put('/:id', protect, authorizedRoles('ADMIN'), updateCoupon);

// delete a coupon
router.delete('/:id', protect, authorizedRoles('ADMIN'), deleteCoupon);



export default router;