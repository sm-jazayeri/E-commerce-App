import express from "express";
import {
    registerUser,
    loginUser,
    me
} from "../../controllers/customer/userController";
import { protect } from "../../middlewares/authMiddleware";


const router = express.Router();


// Register a user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Get the current logged in user
router.get("/me", protect, me);



export default router;