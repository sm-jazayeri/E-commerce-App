import {z} from "zod";

export const adminOrderSchema = z.object({
    status: z.enum([ 'UNPAID', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED' ])
});

