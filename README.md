# 🛒 E-Commerce App

## 📌 Overview
This is a **RESTful API** for an **E-commerce platform**, built with **Node.js, Express, PostgreSQL, and Prisma**. It includes features for **user authentication, product and order management, payments, and discounts**. The API is secured with **JWT authentication** and supports **file uploads for product images**.

---

## 🚀 Features
✔ **User Authentication** – Register, login, JWT authentication, role-based access control  
✔ **Product Management** – CRUD operations for products, image uploads  
✔ **Cart & Order Management** – Add to cart, place orders, track order status  
✔ **Payment Integration** – Secure payments via Saman payment gateway  
✔ **Discount System** – Apply coupons and product discounts  
✔ **API Documentation** – Swagger/OpenAPI for better developer experience  

---

## 🛠️ Tech Stack
- **Backend:** Node.js, Express  
- **Database:** PostgreSQL, Prisma ORM  
- **Authentication:** JWT (JSON Web Token)  
- **File Uploads:** Multer  
- **Testing:** Jest, Supertest 
- **API Documentation:** Swagger   

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/sm-jazayeri/E-commerce-App.git
cd E-commerce-App/backend
```
### 2️⃣ Install Dependencies
``` sh
npm install
```
### 3️⃣ Configure Environment Variables
Create a .env.development file in the backend directory and add:
``` env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_db
JWT_SECRET=your_jwt_secret
PAYMENT_TERMINAL_ID=your_payment_terminal_id
PAYMENT_CALLBACK_URL=your_payment_callback_url
PAYMENT_GATEWAY_URL=your_payment_gateway_url
PAYMENT_SEND_TOKEN_URL=your_payment_send_token_url
PAYMENT_VERIFY_URL=your_payment_verify_url
NODE_ENV=development
```
### 4️⃣ Run Database Migrations
``` sh
npx prisma migrate dev
npx prisma db seed 
```
### 5️⃣ Start the Server
``` sh
npm run start
```
📍Full API Documentation available at:
http://localhost:5000/api-docs

---

## ✅ Running Tests
add a .env.test file in the backend directory and add:
``` env
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce_test_db
JWT_SECRET=your_jwt_secret
PAYMENT_TERMINAL_ID=your_payment_terminal_id
PAYMENT_CALLBACK_URL=your_payment_callback_url
PAYMENT_GATEWAY_URL=your_payment_gateway_url
PAYMENT_SEND_TOKEN_URL=your_payment_send_token_url
PAYMENT_VERIFY_URL=your_payment_verify_url
NODE_ENV=test
```

For running tests:
``` sh
npm test
```

---

## 🔄️ Contributing
Feel free to fork this repository and submit a pull request!

---

## ⚫ License
This project is licensed under the **MIT License**
