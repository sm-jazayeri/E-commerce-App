import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import UserRequest from "../../types/express";



const prisma = new PrismaClient();



// Place order
export const placeOrder = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(404).json({ message: "User not found"});
            return;
        }
        const userId = req.user.id;

        // Find the cart items of the user
        const cart = await prisma.cart.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        if (!cart ||  cart.length === 0) {
            res.status(400).json({ message: "Cart is empty"});
            return;
        }

        // Total price and check stock
        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart[0].items) {
            if (item.product.stock < item.quantity) {
                res.status(400).json({ message: `Not enough stock for ${item.product.name}`});
                return;
            }

            totalAmount += item.quantity * item.product.price;

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
            });
        }

        // Create the order
        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                items: {
                    create: orderItems,
                }
            }
        });

        // Update stock amount
        for (const item of cart[0].items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity }
                },
            })
        }

        // Clear the cart
        const deletedCart = await prisma.cart.deleteMany({
            where: { userId }
        })

        res.status(201).json(order);

    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};


// Get all orders
export const getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                user: true,
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