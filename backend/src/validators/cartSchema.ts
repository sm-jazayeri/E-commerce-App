import {z} from "zod";


export const createCartSchema = z.object({
    productId: z.number().int().positive('Product id must be a positive integer'),
    quantity: z.number().int().positive('Quantity must be a positive integer'),
});


export const updateCartSchema = z.object({
    quantity: z.number().int().positive('Quantity must be a positive integer'),
});
