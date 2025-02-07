import env from "./config/env";
import app from "./app";

// Start the server
const server = app.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
    console.log(`Swagger docs available at http://localhost:${env.PORT}/api-docs`)
});



export default server;
