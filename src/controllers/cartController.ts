import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client"; 
import UserRequest from "../../types/express";


const prisma = new PrismaClient();


// Add item to cart
export const addToCart = async (req: UserRequest, res: Response): Promise<void> => {
    const { productId, quantity } = req.body;

    try {
        // Check if user exists
        if (!req.user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userId = req.user.id
        
        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId}
        });
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        // Find or Create user's cart
        let cart = await prisma.cart.findUnique({
            where: {userId},
        });
        if (!cart) {
            cart = await prisma.cart.create({
                data: { userId },
            })
        }
        // Check if cart item already exists
        const existingItem = await prisma.cartItem.findFirst({
            where: {
                cartId: cart.id,
                productId
            }
        });

        if (existingItem) {
            // Update quantity
            const updatedItem = await prisma.cartItem.update({
                where: { id: existingItem.id },
                data: { quantity: existingItem.quantity + quantity }
            });
            
            res.status(200).json(updatedItem);
            return;
        } else {
            // Add new item
            const newItem = await prisma.cartItem.create({
                data: {
                    cartId: cart.id,
                    productId,
                    quantity,
                    price: product.price
                }
            });
            res.status(201).json(newItem);
            return;
        }

    } catch (err) {
        res.status(500).json({ message: 'Server error', err});
    }
};


// Get cart items
export const getCart = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // Check if user exists
        if (!req.user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userId = req.user.id;

        const cart = await prisma.cart.findUnique({
            where: { userId },
            include: { items: {include: { product: true}}}
        });

        if (!cart || cart.items.length === 0) {
            res.status(200).json({ message: 'Cart is empty', items: []});
            return;
        }
        res.status(200).json(cart);

    } catch (err) {
        res.status(500).json({ message: 'Server error', err});
    }
};


// Update cart item
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
    const { itemId } = req.params;
    const {quantity} = req.body;
    try {

        const item = await prisma.cartItem.findUnique({ where: { id: parseInt(itemId) }});
        if (!item) {
            res.status(404).json({ message: 'Cart item not found'});
            return;
        }
    
        const updatedItem = await prisma.cartItem.update({
            where: { id: parseInt(itemId) },
            data: {quantity},
        });

        res.status(200).json(updatedItem);

    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
};


// Remove cart item
export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
    const { itemId } = req.params;
    
    try {
        const item = await prisma.cartItem.findUnique({
            where: { id: parseInt(itemId) }
        });
        if (!item) {
            res.status(404).json({ message: 'Cart item not found'});
        }
        
        const deletedItem = await prisma.cartItem.delete({
            where: { id: parseInt(itemId) }
        });
        res.status(200).json({ message: 'Item removed'});

    } catch (err) {
        res.status(500).json({ message: 'Server error', err});
    }
};


// Clear cart
export const clearCart = async (req: UserRequest, res: Response): Promise<void> => {
    try {
        // Check if user exists
        if (!req.user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const userId = req.user.id;

        const cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (!cart) {
            res.status(404).json({ message: 'Cart not found' });
            return;
        }

        const deletedItem = await prisma.cartItem.deleteMany({
            where: { cartId: cart.id },
        });

        res.status(200).json({ message: 'Cart cleared'});

    } catch (err) {
        res.status(500).json({ message: 'Server error', err});
    }
    
};