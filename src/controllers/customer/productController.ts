import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import path from "path";



const prisma = new PrismaClient();



// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const products = await prisma.product.findMany();
        
        res.status(200).json(products);

    } catch (err) {
        res.status(500).json({ message: "Error in getting the products", err})

    }
};


// Get a product by id
export const getProductById = async (req: Request, res: Response): Promise <void> => {
    const productId = parseInt(req.params.id);

    try {
        const product = await prisma.product.findUnique({
            where: { id: productId }
        }); 
        
        if (!product) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        
        res.status(200).json(product);
       
    } catch (err) {
        res.status(500).json({ message: "Error in getting the product" });
    }
};

