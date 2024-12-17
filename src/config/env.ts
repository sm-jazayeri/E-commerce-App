const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || '5000';

if(!JWT_SECRET) {
    throw new Error('Missing environment variable: JWT_SECRET');
}




export default {
    JWT_SECRET,
    PORT
};