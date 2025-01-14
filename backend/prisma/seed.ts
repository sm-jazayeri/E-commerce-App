import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


async function main() {
    // Seed users
    await prisma.user.createMany({
        data: [
            { name: 'testuser1', phone: '09001000000', password: 'hashedpassword1', role:'CUSTOMER' },
            { name: 'testuser2', phone: '09002000000', password: 'hashedpassword2', role:'CUSTOMER' },
        ],
    });

    // Seed products 
    await prisma.product.createMany({
        data: [
            { name: 'Product 1', price: 150000, description: 'This is description for product 1'},
            { name: 'Product 2', price: 250000, description: 'This is description for product 2'}
        ],
    });
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