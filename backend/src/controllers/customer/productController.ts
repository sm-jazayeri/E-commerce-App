import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import path from "path";



const prisma = new PrismaClient();



// Get all products
export const getAllProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            name,
            minPrice,
            maxPrice,
            sort = 'createdAt',
            order = 'desc',
            page = '1',
            limit = '10'
        } = req.query;

        // Pagination
        const pageNumber = parseInt(page as string);
        const pageSize = parseInt(limit as string);
        const skip = (pageNumber - 1) * pageSize;

        // Filters
        const filters: any = {};
        if (name) filters.name = name;
        if (minPrice) filters.price = { gte: parseFloat(minPrice as string)};
        if (maxPrice) filters.price = { ...filters.price, lte: parseFloat(maxPrice as string)};

        // Get total count of products for pagination
        const totalCount = await prisma.product.count({ where: filters });

        // Get products
        const products = await prisma.product.findMany({
            where: filters,
            orderBy: {
                [sort as string]: order === 'desc' ? 'desc' : 'asc',
            },
            skip,
            take: pageSize,
        });
        
        res.status(200).json({
            data: products,
            pagination: {
                total: totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
                page: pageNumber,
                limit: pageSize
            }
        });

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

