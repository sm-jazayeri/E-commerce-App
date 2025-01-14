const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || '5000';
const TERMINAL_ID = process.env.PAYMENT_TERMINAL_ID;
const CALLBACK_URL = process.env.PAYMENT_CALLBACK_URL;
const GATEWAY_URL = process.env.PAYMENT_GATEWAY_URL;
const VERIFY_URL = process.env.PAYMENT_VERIFY_URL;

if(!JWT_SECRET) {
    throw new Error('Missing environment variable: JWT_SECRET');
}

if(!TERMINAL_ID) {
    throw new Error('Missing environment variable: TERMINAL_ID');
}

if(!CALLBACK_URL) {
    throw new Error('Missing environment variable: CALLBACK_URL');
}

if(!GATEWAY_URL) {
    throw new Error('Missing environment variable: GATEWAY_URL');
}

if(!VERIFY_URL) {
    throw new Error('Missing environment variable: VERIFY_URL');
}



export default {
    JWT_SECRET,
    PORT,
    TERMINAL_ID,
    CALLBACK_URL,
    GATEWAY_URL,
    VERIFY_URL
};