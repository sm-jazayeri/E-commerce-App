import { describe, it, beforeAll, afterAll, expect, afterEach, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../../src/app"; 
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";


// Set the NODE_ENV to test
dotenv.config({ path: ".env.test" });

const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);


describe("Product API", () => {

    // Test data
    let token: String;
    let adminUser = {
        "name": "Admin",
        "phone": "09987654321",
        "password": "adminPassword1234" 
    }
    let testProduct1 = {
        "name": "product 1",
        "description": "this is the description for the product 1",
        "price": 800000,
        "stock": 10,
        "isDiscounted": false,
        "discount": 20
    };
    let testProduct2 = {
        "name": "product 2",
        "description": "this is the description for the product 2",
        "price": 1000000,
        "stock": 20,
        "isDiscounted": true,
        "discount": 20
    };
    let updatedProduct = { 
        "name": "updated product name",
        "description": "this is the description of the updated product",
        "price": 120000,
        "stock": 30,
        "isDiscounted": true,
        "discount": 30
    }


    beforeEach(async() => {
        // Creating admin user       
        const hashedPassword = await bcrypt.hash(adminUser.password, 10);
        
        await prisma.user.create({
            data: {
                name: adminUser.name,
                phone: adminUser.phone,
                password: hashedPassword,
                role: "ADMIN"
            },
        });

        // Create a test product
        await prisma.product.create({
            data: testProduct1
        })

        // Login with admin user
        const loginRes = await request(app)
            .post("/api/customer/users/login")
            .send({
                phone: adminUser.phone,
                password: adminUser.password,
            });
        token = loginRes.body.token;
        expect(loginRes.status).toBe(200);
    });

    afterEach(async() => {
        // Resetting test database
        console.log("Resetting test database");
        await prisma.$transaction([
          prisma.user.deleteMany(),
          prisma.product.deleteMany()
        ]);
      });

    // ✅ creating a new product
    it("[createProduct] creates a new product", async() => {
        // Create a product
        const createProductRes = await request(app)
            .post('/api/admin/products')
            .send(testProduct2)
            .set('Authorization', `Bearer ${token}`);
        expect(createProductRes.status).toBe(201);
        expect(createProductRes.body.product).toHaveProperty('id');
        const productId = createProductRes.body.product.id;
        // Get the product
        const getProductRes = await request(app)
            .get(`/api/customer/products/${productId}`);
        expect(getProductRes.status).toBe(200);
        expect(getProductRes.body).toHaveProperty('id');
        expect(getProductRes.body.id).toBe(productId);
        expect(getProductRes.body.name).toBe(testProduct2.name);
        expect(getProductRes.body.description).toBe(testProduct2.description);
        expect(getProductRes.body.price).toBe(testProduct2.price);
        expect(getProductRes.body.stock).toBe(testProduct2.stock);
        expect(getProductRes.body.isDiscounted).toBe(testProduct2.isDiscounted);
        expect(getProductRes.body.discount).toBe(testProduct2.discount)
    });

    // ✅ updating an existing product
    it("[updateProduct] updates a product", async() => {
        // Getting the product id
        const getProductBeforeUpdateRes = await request(app)
            .get(`/api/customer/products`);
        expect(getProductBeforeUpdateRes.status).toBe(200);
        expect(getProductBeforeUpdateRes.body.data[0]).toHaveProperty('id');
        const productId = getProductBeforeUpdateRes.body.data[0].id;
        // Updating the product
        const updateProductRes = await request(app)
            .put(`/api/admin/products/${productId}`)
            .send(updatedProduct)
            .set('Authorization', `Bearer ${token}`);
        // Get the product
        const getProductAfterUpdateRes = await request(app)
            .get(`/api/customer/products/${productId}`);
        expect(getProductAfterUpdateRes.status).toBe(200);
        expect(getProductAfterUpdateRes.body.id).toBe(productId);
        expect(getProductAfterUpdateRes.body.name).toBe(updatedProduct.name);
        expect(getProductAfterUpdateRes.body.description).toBe(updatedProduct.description);
        expect(getProductAfterUpdateRes.body.price).toBe(updatedProduct.price);
        expect(getProductAfterUpdateRes.body.stock).toBe(updatedProduct.stock);
        expect(getProductAfterUpdateRes.body.isDiscounted).toBe(updatedProduct.isDiscounted);
        expect(getProductAfterUpdateRes.body.discount).toBe(updatedProduct.discount);
    });


    // ✅ Delete a product
    it("[deleteProduct] delete a product", async() => {
        // Getting the product id
        const getProductBeforeDeleteRes = await request(app)
            .get(`/api/customer/products`);
        expect(getProductBeforeDeleteRes.status).toBe(200);
        expect(getProductBeforeDeleteRes.body.data[0]).toHaveProperty('id');
        const productId = getProductBeforeDeleteRes.body.data[0].id;
        // Deleting the product
        const deleteProductRes = await request(app)
            .delete(`/api/admin/products/${productId}`)
            .set('Authorization', `Bearer ${token}`);
        // Getting product after delete
        const getProductAfterDeleteRes = await request(app)
            .get(`/api/customer/products/${productId}`);
        expect(getProductAfterDeleteRes.status).toBe(404);
    });


});