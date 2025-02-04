import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);


export const calculateDiscountedPrice  = (price: number, discount: number | null) => {
    if (!discount || discount <= 0) return price;     // no discount
    return price - (price * discount) / 100           // apply discounta
}



export const calculateDiscountedAmount = async (cart: any, couponCode: string | undefined) => {
    // Product discount and final amount calculation
    let totalAmount = 0;
    let finalAmount = 0;
    let productDiscountAmount = 0;
    let couponDiscountAmount = 0;
    let couponIsApplied = false;

    for (const item of cart.items) {

        totalAmount += item.quantity * item.product.price;

        item.product.isDiscounted ?
            productDiscountAmount += item.quantity * item.product.price * ( item.product.discount || 0 ) / 100 :
            productDiscountAmount = 0;

        // final amount with product discount
        finalAmount = totalAmount - productDiscountAmount;
    }

    // Coupon and final amount calculation
    if (couponCode) {
        const coupon = await prisma.coupon.findUnique({
            where: { code: couponCode as string }
        });

        if (!coupon || !coupon.isActive || new Date(coupon.expiryDate) < new Date()) {
            return {
                totalAmount,
                finalAmount,
                productDiscountAmount,
                couponDiscountAmount: 0,
                couponIsApplied
            }
        } else {
            couponIsApplied = true;
            couponDiscountAmount = coupon.type === 'PERCENTAGE'
                ? finalAmount * (coupon.discount / 100)
                : coupon.discount;
        }

        // final amount with product discount and coupon discount
        finalAmount = finalAmount - couponDiscountAmount; 
    }

    return {
        totalAmount,
        finalAmount,
        productDiscountAmount,
        couponDiscountAmount,
        couponIsApplied
    }
} 

