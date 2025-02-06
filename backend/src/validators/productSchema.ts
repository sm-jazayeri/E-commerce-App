import {z} from "zod";


export const productSchema = z.object({
    name: z.string().min(2, "Product name must be at least 2 characters").max(100, "Product name cannot exceed 100 characters"),
    description: z.string().min(10, "Description must be at least 10 characters").max(1000, "Description cannot exceed 1000 characters"),
    price: z.number().positive("Price must be a positive number"),
    stock: z.number().int().nonnegative("Stock must be a non-negative integer").optional(),
    isDiscounted: z.boolean().optional(),
    discount: z.number().min(0, "Discount must be 0 or higher").max(100, "Discount cannot exceed 100%").optional(),
});