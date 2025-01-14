import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import UserRequest from "../../../types/express";
import env from "../../config/env";
import axios from 'axios';


const prisma = new PrismaClient();


// Create payment 
export const createPayment = async (req: Request, res: Response): Promise<void> => {
    const { amount, resNum, cellNumber } = req.body;
    try {
        // Send payment request to Saman Bank
        const response = await axios.post(env.GATEWAY_URL, {
            action: 'Token',
            TerminalId: env.TERMINAL_ID,
            Amount: amount,
            ResNum: resNum,
            RedirectUrl: env.CALLBACK_URL,
            CellNumber: cellNumber || '',
        });
        const data = response.data;

        if (data.status !== 1) {
            res.status(400).json({ message: 'Failed to create payment', error: data });
            return;
        }

        // Send token 
        res.json({
            token: data.token,
        });

    } catch (err) {
        res.status(500).json({ message: 'Server error', err });
    }
}



// Verify payment
export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    const { RefNum, ResNum, Status } = req.body;
    try {
        // Handle failed payments
        if (Status !== 'OK') {
            res.status(400).json({ message: 'Payment failed or canceled' });
            return;
        }
        // Verify payment
        const response = await axios.post(env.VERIFY_URL, {
            RefNum: RefNum,
            TerminalNumber: env.TERMINAL_ID,
        });

        const data = response.data;

        // Payment Success
        if (data.Success && data.ResultCode === 0) {
            res.status(200).json({
                message: 'Payment verified successfully!', 
                data: data.TransactionDetail,
            });
            return;
        } else {
            res.status(400).json({
                message: 'Payment verification failed!',
                error: data,
            });
            return;
        }

    } catch (err) {
        res.status(500).json({ message: 'Server error', err});
    }
}