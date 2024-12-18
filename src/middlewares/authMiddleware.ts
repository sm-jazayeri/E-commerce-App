import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
// import express from "express";
import {Request, Response, NextFunction} from 'express';
import userRequest from '../../types/express';
import { JwtPayload } from "jsonwebtoken";
import env from "../config/env";


const prisma = new PrismaClient();

// Middleware to verify user's authentication
export const protect = async (req: userRequest, res: Response, next: NextFunction): Promise<void> => {

    let token;
    if ( 
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
            req.user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: { id: true, name: true, phone: true, role: true }
            });
            next();
        } catch (err) {
            res.status(401).json({ message: "Not authorized" });
            return;
        }
    }

    if (!token) {
        res.status(401).json({ message: "No token provided" });
        return;
    }
};



// Middleware for role-based authorization
export const authorizedRoles = (...roles: string[]) => {
    return (req: userRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            res.status(401).json({ message: "Not authenticated"})
            return;
        }
        if (!roles.includes( req.user.role )) {
            res.status(500).json({ message: "Access denied" })
            return;
        }

        next();
    }
};