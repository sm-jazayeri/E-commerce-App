import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";



const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);


// Get payments for admin
export const getAllPayments = async (req: Request, res: Response) => {
    try {
        const {
            status,
            phone,
            sort = 'createdAt',
            order = 'desc',
            page = '1',
            limit = '10'
        } = req.query
        
        // Pagination
        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(limit as string);
        const skip = (pageNumber - 1) * pageSize;

        // Filters
        const filters: any = {
            ...(status && { status }), 
            ...(phone && { order: { user: { phone }}})
        };

        // Get total count of payments for pagination
        const totalCount = await prisma.payment.count({ where: filters });
        
        // Calculate total payment amount
        const totalAmount = await prisma.payment.aggregate({
            _sum: {amount : true},
            where: filters
        });

        // Get payments
        const payments = await prisma.payment.findMany({
            where: filters,
            orderBy: {
                [sort as string]: order === 'desc' ? 'desc' : 'asc',
            },
            skip,
            take: pageSize,
        });

        res.status(200).json({
            totalAmount: totalAmount._sum.amount || 0,
            data: payments,
            pagination: {
                total: totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                limit: pageSize
            }
        });

    } catch  (err) {
        res.status(500).json({
            message: 'Server error',
            err
        });
    }
};
