import { describe, it, beforeAll, afterAll, expect, afterEach, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../../src/app"; 
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import {
    mockPaymentCreateFailure,
    mockPaymentCreateSuccess,
    mockPaymentVerifyFailure,
    mockPaymentVerifySuccess
} from "../mocks/mockPayment";


// Set the NODE_ENV to test
dotenv.config({ path: ".env.test" });

const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);

describe('Order Flows', () => {

    // Test data
    let customerToken: String;
    let adminToken: String;
    let adminUser = {
        "name": "Admin",
        "phone": "09987654321",
        "password": "adminPassword1234" 
    }
    let customerUser = {
        "name": "Customer",
        "phone": "09991111111",
        "password": "customerPassword1234" 
    }
    let productData1 = {
        "name": "product 1",
        "description": "this is the description for the product 1",
        "price": 800000,
        "stock": 10,
        "isDiscounted": false,
        "discount": 20
    };
    let productData2 = {
        "name": "product 2",
        "description": "this is the description for the product 2",
        "price": 100000,
        "stock": 20,
        "isDiscounted": true,
        "discount": 10
    };



    beforeEach(async() => {
             
        const adminHashedPassword = await bcrypt.hash(adminUser.password, 10);
        // const customerHashedPassword = await bcrypt.hash(customerUser.password, 10);
        // Create admin user
        await prisma.user.create({
            data: {
                name: adminUser.name,
                phone: adminUser.phone,
                password: adminHashedPassword,
                role: "ADMIN"
            },
        });

        // Create a test product
        await prisma.product.create({
            data: productData1
        });
        await prisma.product.create({
            data: productData2
        });

        // Login with admin user
        const adminLoginRes = await request(app)
            .post("/api/customer/users/login")
            .send({
                phone: adminUser.phone,
                password: adminUser.password,
            });
        adminToken = adminLoginRes.body.token;
        expect(adminLoginRes.status).toBe(200);

    });    

    afterEach(async() => {
        // Resetting test database
        console.log("Resetting test database");
        await prisma.$transaction([
          prisma.payment.deleteMany(),
          prisma.orderItem.deleteMany(),
          prisma.order.deleteMany(),
          prisma.cartItem.deleteMany(),
          prisma.cart.deleteMany(),
          prisma.user.deleteMany(),
          prisma.product.deleteMany(),
        ]);
      });


    it('User login & add a product to its cart & place an order with successful payment', async () => {
        // User register successfully
        const userRegisterRes = await request(app)
            .post("/api/customer/users/register")
            .send(customerUser);
        expect(userRegisterRes.status).toBe(201);

        // User login successfully
        const userLoginRes = await request(app)
            .post('/api/customer/users/login')
            .send({
                'phone': customerUser.phone,
                'password': customerUser.password
            });
        expect(userLoginRes.status).toBe(200);
        expect(userLoginRes.body).toHaveProperty('token');
        customerToken = userLoginRes.body.token;

        // User get the list of products
        const productsRes = await request(app)
            .get('/api/customer/products');
        expect(productsRes.status).toBe(200);
        expect(productsRes.body.data).toHaveLength(2);

        // User adds one product item to its cart
        const addCartRes = await request(app)
           .post('/api/customer/cart/add')
           .send({
                "productId": productsRes.body.data[0].id,
                "quantity": 1
           })
           .set('Authorization', `Bearer ${customerToken}`);
        expect(addCartRes.status).toBe(201);

        // User see the product has been added to his cart
        const getCartRes = await request(app)
            .get('/api/customer/cart')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(getCartRes.status).toBe(200);
        expect(getCartRes.body.items).toHaveLength(1);

        // User place an order
        const placeOrderRes = await request(app)
            .post('/api/customer/orders')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(placeOrderRes.status).toBe(201);
        expect(placeOrderRes.body.status).toBe('UNPAID');
        const orderId = placeOrderRes.body.id;
        
        // Successful create payment
        mockPaymentCreateSuccess();
        const createPaymentRes = await request(app)
            .post('/api/customer/payments/create')
            .send({"orderId": orderId})
            .set('Authorization', `Bearer ${customerToken}`);
        expect(createPaymentRes.status).toBe(201);
        expect(createPaymentRes.body).toHaveProperty('token');
        
        // Payment should exist and have PENDING status
        let paymentCreate = await prisma.payment.findFirst({
            where: {orderId}
        });
        expect(paymentCreate?.status).toBe('PENDING');

        // After successful verify payment payment status should change to COMPLETED
        await mockPaymentVerifySuccess(orderId);
        let paymentVerify = await prisma.payment.findFirst({
            where: {orderId}
        });
        expect(paymentVerify?.status).toBe('COMPLETED');
    });

    it('User login & add a product to its cart & place an order with failed payment', async () => {
        // User register successfully
        const userRegisterRes = await request(app)
            .post("/api/customer/users/register")
            .send(customerUser);
        expect(userRegisterRes.status).toBe(201);

        // User login successfully
        const userLoginRes = await request(app)
            .post('/api/customer/users/login')
            .send({
                'phone': customerUser.phone,
                'password': customerUser.password
            });
        expect(userLoginRes.status).toBe(200);
        expect(userLoginRes.body).toHaveProperty('token');
        customerToken = userLoginRes.body.token;

        // User get the list of products
        const productsRes = await request(app)
            .get('/api/customer/products');
        expect(productsRes.status).toBe(200);
        expect(productsRes.body.data).toHaveLength(2);

        // User adds one product item to its cart
        const addCartRes = await request(app)
           .post('/api/customer/cart/add')
           .send({
                "productId": productsRes.body.data[0].id,
                "quantity": 1
           })
           .set('Authorization', `Bearer ${customerToken}`);
        expect(addCartRes.status).toBe(201);

        // User see the product has been added to his cart
        const getCartRes = await request(app)
            .get('/api/customer/cart')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(getCartRes.status).toBe(200);
        expect(getCartRes.body.items).toHaveLength(1);

        // User place an order
        const placeOrderRes = await request(app)
            .post('/api/customer/orders')
            .set('Authorization', `Bearer ${customerToken}`);
        expect(placeOrderRes.status).toBe(201);
        expect(placeOrderRes.body.status).toBe('UNPAID');
        const orderId = placeOrderRes.body.id;
        
        // Successful create payment
        mockPaymentCreateSuccess();
        const createPaymentRes = await request(app)
            .post('/api/customer/payments/create')
            .send({"orderId": orderId})
            .set('Authorization', `Bearer ${customerToken}`);
        expect(createPaymentRes.status).toBe(201);
        expect(createPaymentRes.body).toHaveProperty('token');
        
        // Payment should exist and have PENDING status
        let paymentCreate = await prisma.payment.findFirst({
            where: {orderId}
        });
        expect(paymentCreate?.status).toBe('PENDING');

        // After Failed verify payment payment status should change to FAILED
        await mockPaymentVerifyFailure(orderId);
        let paymentVerify = await prisma.payment.findFirst({
            where: {orderId}
        });
        expect(paymentVerify?.status).toBe('FAILED');
    });
});