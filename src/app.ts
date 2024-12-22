import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import env from "./config/env";
import path from 'path';
import cartRoutes from './routes/cartRoutes'



const app = express();


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);


// Default route for testing
app.get('/', (req, res) => {
    res.send(`Welcome to the e-commerce app...`);
});


// Start the server
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    console.log(`Swagger docs available at http://localhost:${env.PORT}/api-docs`)
});
