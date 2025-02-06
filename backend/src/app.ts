import express from 'express';
import dotenv from'dotenv';
import userRoutes from './routes/customer/userRoutes';
import productRoutes from './routes/customer/productRoutes';
import cartRoutes from './routes/customer/cartRoutes';
import orderRoutes from './routes/customer/orderRoutes';
import adminUserRoutes from './routes/admin/adminUserRoutes';
import adminProductRoutes from './routes/admin/adminProductRoutes';
import adminOrderRoutes from './routes/admin/adminOrderRoutes';
import paymentRoutes from './routes/customer/paymentRoutes';
import adminPaymentRoutes from './routes/admin/adminPaymentRoutes';
import adminCouponRoutes from './routes/admin/adminCouponRoutes';
import env from "./config/env";
import path from 'path';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';



const app = express();


// Load the swagger YAML file & serve swagger UI
const swaggerDocument = YAML.load('./docs/swagger.yaml');
swaggerDocument.servers = [
    { url: `http://localhost:${env.PORT}` },
  ];
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(helmet());

// Rate limiter middleware
const loginLimiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minutes
    max: 2, // Allow max 2 attempts
    message: {
      message: 'Too many login attempts. Try again later.',
    },
    headers: true,
});
app.use('/api/customer/users/login', loginLimiter);


// Customer endpoints
app.use("/api/customer/users", userRoutes);
app.use("/api/customer/products", productRoutes);
app.use("/api/customer/cart", cartRoutes);
app.use("/api/customer/orders", orderRoutes);
app.use("/api/customer/payments", paymentRoutes);

// Admin endpoints
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/products", adminProductRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/admin/payments", adminPaymentRoutes);
app.use("/api/admin/coupons", adminCouponRoutes);


// Default route for testing
app.get('/', (req, res) => {
    res.send(`Welcome to the e-commerce app...`);
});


// Start the server
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    console.log(`Swagger docs available at http://localhost:${env.PORT}/api-docs`)
});
