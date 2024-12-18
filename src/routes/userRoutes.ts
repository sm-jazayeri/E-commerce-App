import express from "express";
import {
    registerUser,
    loginUser,
    me,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser } from "../controllers/userController";
import { protect, authorizedRoles } from "../middlewares/authMiddleware";


const router = express.Router();


// Register a user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Get the current logged in user
router.get("/me", protect, me);

// Get All users
router.get("/", protect, authorizedRoles('ADMIN'), getAllUsers);

// Get a user by id
router.get("/:id", protect, authorizedRoles('ADMIN'), getUserById);

// Update user information
router.put("/:id", protect, authorizedRoles('ADMIN'), updateUser);

// Delete a user
router.delete("/:id", protect, authorizedRoles('ADMIN'), deleteUser)



export default router;