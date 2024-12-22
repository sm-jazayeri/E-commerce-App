import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserRequest from "../../types/express";
import env from "../config/env";


const prisma = new PrismaClient();

// Register a user
export const registerUser = async (req: UserRequest, res: Response) => {
    const { name, phone, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                name,
                phone,
                password: hashedPassword,
            },
        });
        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user.id,
                name: user.name,
                phone: user.phone,
            },
        });
    } catch (err) {
        res.status(400).json({
            message: "Error in registering the user",
            err
        });
    }
};


// Login a user
export const loginUser = async (req: UserRequest, res: Response): Promise<void> => {
    const { phone, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            res.status(401).json({ message: "Invalid credential" });
            return;
        } 

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid credential" });
            return;
        }

        const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({
            message: "Login successful",
            token,
        });

    } catch (err) {
        res.status(500).json({
            message: "Error logging in",
            err
        });
    }
};


// Get the current logged in user
export const me = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json({ user: req.user });
    } catch (err) {
        res.status(500).json({ err });
    }
};


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


