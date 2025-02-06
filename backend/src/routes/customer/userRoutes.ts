import express from "express";
import {
    registerUser,
    loginUser,
    me
} from "../../controllers/customer/userController";
import { protect } from "../../middlewares/authMiddleware";
import validateRequest from "../../middlewares/validateRequest";
import { registerUserSchema, loginUserSchema } from "../../validators/userSchema";


const router = express.Router();


// Register a user
router.post("/register", validateRequest(registerUserSchema), registerUser);

// Login a user
router.post("/login",validateRequest(loginUserSchema) ,loginUser);

// Get the current logged in user
router.get("/me", protect, me);



export default router;