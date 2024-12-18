import express from "express";
import {
    registerUser,
    loginUser,
    me,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser } from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";


const router = express.Router();


// Register a user
router.post("/register", registerUser);

// Login a user
router.post("/login", loginUser);

// Get the current logged in user
router.get("/me", protect, me);

// Get All users
router.get("/", protect, getAllUsers);

// Get a user by id
router.get("/:id", protect, getUserById);

// Update user information
router.put("/:id", protect, updateUser);

// Delete a user
router.delete("/:id", protect, deleteUser)



export default router;