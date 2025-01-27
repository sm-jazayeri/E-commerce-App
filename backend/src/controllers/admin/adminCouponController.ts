import { Prisma, PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {formatDateToISO} from "../../utils/date";



const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);



// Get all Coupon
export const getAllCoupon = async (req: Request, res: Response): Promise<void> => {
    const {
        sort = 'createdAt',
        order = 'desc',
        page = '1',
        limit = '10'
    } = req.query

    // Pagination
    const pageNumber = parseInt(page as string);
    const pageSize = parseInt(limit as string);
    const skip = (pageNumber - 1) * pageSize;

    try {
        // Get total count of coupon for pagination
        const totalCount = await prisma.coupon.count();

        const coupons = await prisma.coupon.findMany({
            orderBy: {
                [sort as string]: order === 'desc' ? 'desc' : 'asc',
            },
            skip,
            take: pageSize,
        });

        res.status(200).json({
            data: coupons, 
            pagination: {
                total: totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                limit: pageSize
            }
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};


// Create a coupon
export const createCoupon = async (req: Request, res: Response): Promise<void> => {
    const {code, discount, type, expiryDate, isActive} = req.body;

    const expiryDateISO = formatDateToISO(expiryDate);

    try {
        // Check that coupon code is unique
        const couponWithCode = await prisma.coupon.findFirst({
            where: { code }
        });

        if (couponWithCode) {
            res.status(400).json({ message: "Coupon already exists!"});
            return;
        }
        // Create coupon
        const coupon = await prisma.coupon.create({
            data: {
                code,
                discount,
                type,
                expiryDate: expiryDateISO,
                isActive
            }
        });

        res.status(201).json({message: "Coupon created successfully", coupon});

    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};



// Update a coupon
export const updateCoupon = async (req: Request, res: Response): Promise<void> => {
    const couponId = parseInt(req.params.id);
    const {code, discount, type, expiryDate, isActive} = req.body;

    const expiryDateISO = formatDateToISO(expiryDate);

    try {
        // Check that coupon with this id exists
        const coupon = await prisma.coupon.findUnique({
            where: { id: couponId }
        });

        if (!coupon) {
            res.status(404).json({ message: "Coupon not found" });
            return;
        }
        // Check that coupon code is unique
        const couponWithCode = await prisma.coupon.findFirst({
            where: { code }
        });

        if (couponWithCode && couponWithCode.id !== couponId) {
            res.status(400).json({ message: "Coupon already exists!" });
            return;
        }

        // Update coupon
        const updatedCoupon = await prisma.coupon.update({
            where: { id: couponId },
            data: {
                code,
                discount,
                type,
                expiryDate: expiryDateISO,
                isActive
            }
        });

        res.status(200).json({ message: "Coupon updated successfully", updatedCoupon });

    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};



// Delete a coupon
export const deleteCoupon = async (req: Request,  res: Response): Promise<void> => {
    const couponId = parseInt(req.params.id);

    try {
        // Check that coupon with this id exists
        const coupon = await prisma.coupon.findFirst({
            where: { id: couponId }
        });
        
        if (!coupon) {
            res.status(404).json({ message: "Coupon not found!" });
            return;
        }
        
        // Delete coupon
        const deletedCoupon  = await prisma.coupon.delete({
            where: { id: couponId }
        });

        res.status(200).json({ message: "Coupon deleted successfully", deletedCoupon });

    } catch (err) {
        res.status(500).json({ message: "Server error", err });
    }
};
