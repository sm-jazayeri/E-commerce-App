import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import env from "./config/env";



const app = express();


app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// Default route for testing
app.get('/', (req, res) => {
    res.send(`Welcome to the e-commerce app...`);
});


// Start the server
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
});
