import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserRequest from "../../../types/express";
import env from "../../config/env";


const prisma = new PrismaClient();



// Get All users
export const getAllUsers = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const users = await prisma.user.findMany({
            select: {id: true, name: true, phone: true, role: true},
        });
        res.status(200).json(users);

    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch users', err });
    }
};


// Get a user by id
export const getUserById = async (req: UserRequest, res: Response): Promise<void> => {
 
    const userId = parseInt(req.params.id);

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, phone: true, role: true},
        });
        
        if (!user) {
            res.status(404).json({message: "User not found"});
            return;
        }
        res.status(200).json(user);

    } catch (err) {
        res.status(500).json({message: 'Failed to fetch user', err});
    }
};


// Update user information
export const updateUser = async (req: UserRequest, res: Response): Promise<void> => {
   
    const { name, phone } = req.body;
    const userId = parseInt(req.params.id);

    try {
        // Checks if the user exists
        const user = await prisma.user.findUnique({
            where: {id: userId}
        });
        if (!user) {
            res.status(404).json({message: "User not found"});
            return;
        }
        // Checks if user with the same phone number exists
        const existingUser = await prisma.user.findFirst({
            where: { 
                phone: phone,
                NOT: { id: userId },
            },
        });
        if (existingUser) {
            res.status(400).json({ message: "User with this phone number already exists"});
            return;
        }
        // Updates the user
        const updatedUser = await prisma.user.update({
            where: { id: userId},
            data: { name, phone },
            select: { id: true, phone: true, name: true}
        });
        res.status(200).json(updatedUser);

    } catch (err) {
        res.status(500).json({ message: "Failed to update the user", err });
    }
};


// Delete a user
export const deleteUser = async (req: UserRequest, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id);

    try {
        // Checks if the user exists
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        // Delete the user
        const deletedUser = await prisma.user.delete({
            where: { id: userId }
        })
        res.status(200).json({message: "User deleted successfully"})

    } catch (err) {
        res.status(500).json({ message: "Failed to delete the user", err });
    }
};


