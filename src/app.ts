import express from 'express';
import 'dotenv/config';
import userRoutes from './routes/userRoutes';


const app = express();


app.use(express.json());
app.use("/api/users", userRoutes)


// Default route for testing
app.get('/', (req, res) => {
    res.send(`Welcome to the e-commerce app...`)
})


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
