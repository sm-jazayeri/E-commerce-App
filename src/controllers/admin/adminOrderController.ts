import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";



const prisma = new PrismaClient();



// Get all orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
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
        res.status(200).json(orders);

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