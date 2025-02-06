import {z} from "zod";


export const couponSchema = z.object({
    code: z.string().min(5, 'Coupon code must be at least 5 character long'),
    discount: z.number().positive("Discount must be greater than 0"),
    type: z.enum(["PERCENTAGE", "FLAT"]),
    expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expiry date must be in YYYY-MM-DD format"),
    isActive: z.boolean()
}).superRefine((data, ctx) => {
    if (data.type === "PERCENTAGE" && (data.discount > 100)) {
        ctx.addIssue({
          path: ["discount"],
          message: "PERCENTAGE discount must be between 1 and 100",
          code: "custom",
        });
      }
})