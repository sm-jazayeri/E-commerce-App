import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/userRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import env from "./config/env";
import path from 'path';
// import YAML from 'yamljs';
// import swaggerUi from 'swagger-ui-express';



const app = express();

// TODO: Add swagger documentation
// Load the swagger YAML file & serve swagger UI
// const swaggerDocument = YAML.load('./docs/swagger.yaml');
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);


// Default route for testing
app.get('/', (req, res) => {
    res.send(`Welcome to the e-commerce app...`);
});


// Start the server
app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    console.log(`Swagger docs available at http://localhost:${env.PORT}/api-docs`)
});
