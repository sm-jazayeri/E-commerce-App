import express from "express";
import {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser } from "../../controllers/admin/adminUserController";
import { protect, authorizedRoles } from "../../middlewares/authMiddleware";


const router = express.Router();



// Get All users
router.get("/", protect, authorizedRoles('ADMIN'), getAllUsers);

// Get a user by id
router.get("/:id", protect, authorizedRoles('ADMIN'), getUserById);

// Update user information
router.put("/:id", protect, authorizedRoles('ADMIN'), updateUser);

// Delete a user
router.delete("/:id", protect, authorizedRoles('ADMIN'), deleteUser);



export default router;