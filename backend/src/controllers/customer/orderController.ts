import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import UserRequest from "../../../types/express";
import {calculateDiscountedAmount} from "../../utils/discount";



const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);



// Place order
export const placeOrder = async (req: UserRequest, res: Response): Promise<void> => {
    
    const couponCode = req.query.couponCode;

    try {
        if (!req.user) {
            res.status(404).json({ message: "User not found"});
            return;
        }
        const userId = req.user.id;

        // Find the cart items of the user
        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        if (!cart) {
            res.status(400).json({ message: "Cart is empty"});
            return;
        }

        // add order items
        const orderItems = [];
        for (const item of cart.items) {
            if (item.product.stock < item.quantity) {
                res.status(400).json({ message: `Not enough stock for ${item.product.name}`});
                return;
            }

            orderItems.push({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price,
            });
        }

        // Calculate discounted price
        const priceData = calculateDiscountedAmount(cart, couponCode as string);

        // Create the order
        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount: (await priceData).totalAmount,
                finalAmount: (await priceData).finalAmount,
                items: {
                    create: orderItems,
                }
            }
        });

        // Update stock amount
        for (const item of cart.items) {
            await prisma.product.update({
                where: { id: item.productId },
                data: {
                    stock: { decrement: item.quantity }
                },
            });
        }

        // Clear the cart
        const deletedCart = await prisma.cart.deleteMany({
            where: { userId }
        });

        // Deactivate coupon if applied
        if ((await priceData).couponIsApplied) {

            await prisma.coupon.update({
                where: { code: couponCode as string},
                data: { isActive: false}
            });
        }

        res.status(201).json(order);

    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};




// Get orders of the logged in user
export const getOrders = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;

        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json(orders);

    } catch (err) {
        res.status(500).json({ message: 'Server error', err});
    }
};


// Get an order by id
export const getOrderById = async(req: UserRequest, res: Response): Promise<void> => { 
    const userId = req.user?.id;
    const { id } = req.params;

    try {
        const order = await prisma.order.findUnique({
            where: {
                id: parseInt(id),
                userId
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            res.status(404).json({ message: 'Order not found'});
        }

        res.status(200).json(order);

    } catch (err) {
        res.status(500).json({ message: 'Server error', err});

    }
};