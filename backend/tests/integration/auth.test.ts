import { describe, it, beforeAll, afterAll, expect, afterEach, beforeEach } from "@jest/globals";
import request from "supertest";
import app from "../../src/app"; 
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";




const prisma = new PrismaClient(
    {
        log: ['query', 'info', 'warn', 'error']
    }
);


describe("Authentication API", () => {

    // Test data
    let testUser1 = {
        name: "test user 1",
        phone: "09884444444",
        password: "password123",
    }; 
    let testUser2 = {
        name: "test user 2",
        phone: "09884444445",
        password: "password321",
    }; 

    beforeEach(async () => {
        // Create a test user
        const hashedPassword = await bcrypt.hash(testUser1.password, 10);
        await prisma.user.create({
            data: {
                name: testUser1.name,
                phone: testUser1.phone,
                password: hashedPassword,
            },
        });
    });

    afterEach(async() => {
        // Resetting test database
        console.log("Resetting test database");
        await prisma.$transaction([
          prisma.user.deleteMany(),
          prisma.product.deleteMany(),
          prisma.order.deleteMany(),
          prisma.orderItem.deleteMany(),
          prisma.cart.deleteMany(),
          prisma.cartItem.deleteMany(),
          prisma.coupon.deleteMany()
        ]);
      });


    // ✅ user successful registration
    it("[Register] should register a new user", async() => {
        const res = await request(app)
            .post("/api/customer/users/register")
            .send(testUser2);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user.phone).toBe(testUser2.phone);
    });

    // ❌ registration with existing phone number
    it("[Register] should not register a user with an existing phone number", async() => {
        const res = await request(app)
            .post("/api/customer/users/register")
            .send(testUser1);
        
        expect(res.status).toBe(400);
    });

    // ✅ login with correct credentials
    it("[Login] should login a user with correct credentials", async() => {
        const res = await request(app)
            .post("/api/customer/users/login")
            .send({
                phone: testUser1.phone,
                password: testUser1.password,
            });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("token");
    });

    // ❌ login with incorrect credential
    it("[Login] should not login a user with incorrect credentials", async() => {
        const res = await request(app)
            .post("/api/customer/users/login")
            .send({
                phone: testUser1.phone,
                password: "wrongPassword",
            });

        expect(res.status).toBe(401);
    });

    // ✅ Protected Route (`GET /me`) with token
    it("[Me] should return the authenticated user info", async() => {
        // login 
        const loginRes = await request(app)
        .post("/api/customer/users/login")
        .send({
            phone: testUser1.phone,
            password: testUser1.password,
        });
        let token = loginRes.body.token;
        
        expect(loginRes.status).toBe(200);
        // Get user info from /me endpoint
        const res = await request(app)
            .get("/api/customer/users/me")
            .set('Authorization', `Bearer ${token}`);
       
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty("user");
        expect(res.body.user.phone).toBe(testUser1.phone);
    });

    // ❌ Protected Route (`GET /me`) without token
    it("[Me] should not return the user info without token", async () => {
        const res = await request(app)
            .get("/api/customer/users/me");

        expect(res.status).toBe(401)
    });

});