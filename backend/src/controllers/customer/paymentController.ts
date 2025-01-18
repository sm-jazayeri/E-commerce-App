import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import UserRequest from "../../../types/express";
import env from "../../config/env";
import axios from 'axios';
import { v4 as uuidv4} from "uuid";


const prisma = new PrismaClient();


// Create payment 
export const createPayment = async (req: UserRequest, res: Response): Promise<void> => {
    const { orderId } = req.body;     
try {
        // Check that req.user exists
        if (!req.user) {
            res.status(404).json({ message: "User not found"});
            return;
        }
        
        // Check that the order exists
        const order = await prisma.order.findUnique({
            where: {id: orderId}
        });

        if (!order) {
            res.status(404).json({
                message: "Order not found!"
            });
            return;
        }

        // Check that order belongs to the authenticated user
        if (order.userId !== req.user.id) {
            res.status(403).json({
                message: 'Unauthorized to create payment for this order'
            });
            return;
        }

        // Check that order is unpaid
        if (order.status !== 'UNPAID') {
            res.status(400).json({
                message: "Order is already paid"
            });
            return;
        }

        // Convert amount to Rial
        const amount = parseInt(order.totalAmount.toString() + "0");

        // Unique resNum 
        const resNum = uuidv4();

        // Send payment request to Saman Bank
        const response = await axios.post(env.GATEWAY_URL, {
            action: 'Token',
            TerminalId: env.TERMINAL_ID,
            Amount: amount,
            ResNum: resNum,
            RedirectUrl: env.CALLBACK_URL,
        });

        const data = response.data;

        if (data.status !== 1) {
            res.status(400).json({ message: 'Failed to create payment', error: data });
            return;
        }

        // Create payment 
        const payment = await prisma.payment.create({
            data: {
                amount,
                orderId,
                resNum,
            }
        });

        // Send token & gatewayUrl in response
        res.status(201).json({
            token: data.token,
            gatewayUrl: `${env.SEND_TOKEN_URL}?Token=${data.token}`
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
}



// Verify payment
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    const { RefNum, ResNum, Status, TraceNo } = req.body;
    try {

        // Handle failed payments
        if (Status !== '2') {
            // Update payment status to Failed
            await prisma.payment.update({
                where: {resNum: ResNum},
                data: {status: "FAILED"}
            });
            res.status(400).json({ message: 'Payment failed or canceled' });
            return;
        }

        // Check that Payment with ResNum exists
        const payment = await prisma.payment.findUnique({
            where: {resNum: ResNum}
        });
        if (!payment) {
            res.status(404).json({message: "Payment with this resNum doesn't exist"})
            return;
        }

        // Check that receipt already doesnt exist
        const refNum = await prisma.payment.findFirst({
            where: {refNum: RefNum}
        });
        if (refNum) {
            // Update payment status to Failed
            await prisma.payment.update({
                where: {resNum: ResNum},
                data: {status: "FAILED"}
            });
            res.status(400).json({ message: 'Receipt already exists'});
            return;
        }

        // Update payment metadata
        await prisma.payment.update({
            where: {id: payment.id},
            data: {
                refNum: RefNum,
                traceNum: TraceNo, 
            }
        });

        // Verify payment
        const response = await axios.post(env.VERIFY_URL, {
            RefNum: RefNum,
            TerminalNumber: env.TERMINAL_ID,
        });

        const data = response.data;

        // Payment Success
        if (data.Success && data.ResultCode === 0) {
            // Update payment status
            await prisma.payment.update({
                where: {resNum: ResNum},
                data: {status: "COMPLETED"}
            });

            // Update order status
            await prisma.order.update({
                where: {id: payment.orderId},
                data: {status: "PAID"}
            });

            res.status(200).json({
                message: 'Payment verified successfully!', 
                data: data,
            });
            return;

        } else {

            // Update payment status
            await prisma.payment.update({
                where: {resNum: ResNum},
                data: {status: "FAILED"}
            });
            res.status(400).json({
                message: 'Payment verification failed!',
                error: data,
            });
            return;
        }

    } catch (err) {
        res.status(500).json({ message: 'Server error', err});
    }
};


// Get payments for customer
export const getPayments = async (req: UserRequest, res: Response) => {
    try {
        if (!req.user) {
            res.status(404).json({message: "User not found"});
            return;
        }
        const userId = req.user.id
        const {
            status,
            sort = 'createdAt',
            order = 'desc',
            page = '1',
            limit = '10'
        } = req.query
        
        // Pagination
        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(limit as string);
        const skip = (pageNumber - 1) * pageSize;

        // Filters
        const filters: any = {
            ...(status && { status }), 
            order: { userId }, 
        };

        // Get total count of payments for pagination
        const totalCount = await prisma.payment.count({ where: filters });

        // Get payments
        const payments = await prisma.payment.findMany({
            where: filters,
            orderBy: {
                [sort as string]: order === 'desc' ? 'desc' : 'asc',
            },
            skip,
            take: pageSize,
        });

        res.status(200).json({
            data: payments,
            pagination: {
                total: totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                limit: pageSize
            }
        });

    } catch  (err) {
        res.status(500).json({
            message: 'Server error',
            err
        });
    }
};