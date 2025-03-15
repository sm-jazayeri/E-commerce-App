import { PrismaClient } from '@prisma/client';
import bcrypt from "bcrypt";



const prisma = new PrismaClient();


async function main() {
    // Seed users
    const adminPassword = 'adminPassword1234';
    const customerPassword = 'customerPassword1234';
    const adminHashedPassword = await bcrypt.hash(adminPassword, 10);
    const customerHashedPassword = await bcrypt.hash(customerPassword, 10);
    await prisma.user.createMany({
        data: [
            { name: 'adminUser', phone: '09001000000', password: adminHashedPassword, role:'ADMIN' },
            { name: 'customerUser', phone: '09002000000', password: customerHashedPassword, role:'CUSTOMER' },
        ],
    });

    // Seed products 
    await prisma.product.createMany({
        data: [
            { name: 'Product 1', price: 150000, description: 'This is description for product 1', "stock": 0, "discount": 20, "isDiscounted": false},
            { name: 'Product 2', price: 250000, description: 'This is description for product 2', "stock": 1, "discount": 20, "isDiscounted": false},
            { name: 'Product 3', price: 250000, description: 'This is description for product 3', "stock": 2, "discount": 20, "isDiscounted": false},
            { name: 'Product 4', price: 250000, description: 'This is description for product 4', "stock": 3, "discount": 20, "isDiscounted": false},
            { name: 'Product 5', price: 250000, description: 'This is description for product 5', "stock": 4, "discount": 20, "isDiscounted": false},
            { name: 'Product 6', price: 250000, description: 'This is description for product 6', "stock": 5, "discount": 20, "isDiscounted": true},
            { name: 'Product 7', price: 250000, description: 'This is description for product 7', "stock": 5, "discount": 20, "isDiscounted": true},
            { name: 'Product 8', price: 250000, description: 'This is description for product 8', "stock": 5, "discount": 20, "isDiscounted": true},
            { name: 'Product 9', price: 250000, description: 'This is description for product 9', "stock": 5, "discount": 20, "isDiscounted": true},
            { name: 'Product 10', price: 250000, description: 'This is description for product 10', "stock": 5, "discount": 20, "isDiscounted": true},
        ],
    });

    // Seed coupons 

    console.log('Database seeded successfully')
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });