import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import UserRequest from "../../../types/express";
import env from "../../config/env";


const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);

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


