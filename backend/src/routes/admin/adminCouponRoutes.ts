import express from "express";
import {protect, authorizedRoles} from "../../middlewares/authMiddleware";
import { 
    getAllCoupon,
    createCoupon, 
    updateCoupon, 
    deleteCoupon } from "../../controllers/admin/adminCouponController";
import validateRequest from "../../middlewares/validateRequest";
import {couponSchema} from "../../validators/couponSchema";

const router = express.Router();


// Get all coupons
router.get('/', protect, authorizedRoles('ADMIN'), getAllCoupon);

// Create a coupon
router.post('/', protect, authorizedRoles('ADMIN'), validateRequest(couponSchema), createCoupon);

// Update a coupon
router.put('/:id', protect, authorizedRoles('ADMIN'), validateRequest(couponSchema), updateCoupon);

// delete a coupon
router.delete('/:id', protect, authorizedRoles('ADMIN'), deleteCoupon);



export default router;