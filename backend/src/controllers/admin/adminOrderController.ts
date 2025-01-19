import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";



const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);



// Get all orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            userId,
            status,
            sort = 'createdAt',
            order = 'desc',
            page = '1',
            limit = '10'
        } = req.query;

        // Pagination
        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(limit as string);
        const skip = (pageNumber - 1) * pageSize;

        // Filters
        const filters: any = {};
        if (userId) filters.userId = parseInt(userId as string);
        if (status) filters.status = status;

        // Get total count of orders for pagination
        const totalCount = await prisma.order.count({ where: filters });

        // Get orders
        const orders = await prisma.order.findMany({
            where: filters,
            orderBy: {
                [sort as string]: order === 'desc' ? 'desc' : 'asc',
            },
            skip,
            take: pageSize,
            include: {
                user: {
                    select: { id: true, name: true, phone: true, role: true }
                },
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });
        res.status(200).json({
            data: orders,
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


// Get order by Id
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
        const order = await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: true,
                items: {
                    include: {
                        product: true
                    }
                }
            }
        });

        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        res.status(200).json(order);

    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};


// Update order status
export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.status(200).json(order);

    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};