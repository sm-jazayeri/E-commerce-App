import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import path from "path";



const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);


// Create a product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const {name, description, price, stock, isDiscounted, discount} = req.body;

    // Convert isDiscounted to boolean if it's a string
    const isDiscountedBool = isDiscounted === 'true' ? true : isDiscounted === 'false' ? false : false;

    try {
        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                stock: parseInt(stock), 
                isDiscounted: isDiscountedBool,
                discount: parseFloat(discount)
            }
        });

        res.status(201).json({ message: "Product created successfully", product });

    } catch (err) {
        res.status(500).json({ message: "Error in creating the product", err})
    }
};



// Update a product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const productId = parseInt(req.params.id);
    const {name, description, price, stock, isDiscounted, discount} = req.body;

    // Convert isDiscounted to boolean if it's a string
    const isDiscountedBool = isDiscounted === 'true' ? true : isDiscounted === 'false' ? false : false;

    try {
        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            res.status(404).json({ message: "Product not found"});
            return;
        }

        // Update
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data : { 
                name,
                description, 
                price: parseInt(price),
                stock: parseInt(stock), 
                isDiscounted: isDiscountedBool,
                discount: parseFloat(discount)
            },
        });

        res.status(200).json({ message: "Product updated successfully", updatedProduct});

    } catch (err) {
        res.status(500).json({ message: "Error in updating the product", err})
    }
};


// Delete a product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const productId = parseInt(req.params.id);

    try {
        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id : productId},
        });
        
        if (!product) {
            res.status(404).json({ message: "Product not found" });
        }

        // Delete
        const deletedProduct = await prisma.product.delete({
            where: { id: productId }
        });

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (err) {
        res.status(500).json({ message: "Error in deleting product" });
    }
};

// Upload product image
export const uploadImage = async (req: Request, res: Response): Promise<void> => {
    const productId = parseInt(req.params.id);
    const imageUrl = req.file ? path.posix.join('/uploads/products', req.file.filename) : undefined;
    
    try {
        // Check if product exists
        const product = await prisma.product.findUnique({
            where: { id: productId }
        });

        if (!product) {
            res.status(404).json({ message: "Product not found"});
            return;
        }

        // Upload image
        await prisma.product.update({
            where: { id: productId },
            data : { 
                ...(imageUrl && {imageUrl}), // update image if image exists
            },
        });

        res.status(200).json({ message: "Image uploaded successfully"});

    } catch (err) {
        res.status(500).json({ message: "Error in uploading image", err});
    }
};