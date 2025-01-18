import express from "express";
import {getAllPayments} from "../../controllers/admin/adminPaymentController";
import {protect, authorizedRoles} from "../../middlewares/authMiddleware";


const router = express.Router();


// Get all payments
router.get('/', protect, authorizedRoles("ADMIN"), getAllPayments)



export default router;