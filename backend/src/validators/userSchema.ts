import { z } from "zod";

const phoneRegex = /^0\d{10}$/;


export const registerUserSchema  = z.object({
    name: z.string().min(2).max(50),
    password: z.string().min(8),
    phone: z
        .string()
        .length(11, { message: "Phone number must be 11 digits" })
        .regex(phoneRegex, { message: "Invalid phone number" }),
});


export const loginUserSchema = z.object({
    phone: z.string(),
    password: z.string(),
});


export const updateUserSchema = z.object({
    name: z.string().min(2).max(50),
    phone: z
        .string()
        .length(11, { message: "Phone number must be 11 digits" })
        .regex(phoneRegex, { message: "Invalid phone number" }),
});