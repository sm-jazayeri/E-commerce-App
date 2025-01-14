// V1

// import {Request} from 'express';

// declare module 'express' {
//     export interface Request {
//         headers: {
//             authorization?: string;
//         };
//         user? : {
//            id: number;
//            role: string;
//            name: string;
//            phone: string;
//         } | null;
//     }
// }


// V2

// declare global {
//     namespace Express {
//         interface Request {
//             headers: {
//                 authorization?: string;
//             };
//             user? : {
//                 id: number;
//                 role: string;
//                 name: string;
//                 phone: string;
//             } | null;
//         }
//     }
// }


// V3
// import Request from 'express';

// declare module 'express' {
//     interface Request {
//         headers: {
//             authorization?: string;
//         };
//         user? : {
//            id: number;
//            role: string;
//            name: string;
//            phone: string;
//         } | null;
//     }
// }

// export default Request;


// V4
// import {Request} from 'express';

// interface Request {
//             headers: {
//                 authorization?: string;
//             };
//             user? : {
//                id: number;
//                role: string;
//                name: string;
//                phone: string;
//             } | null;
//         }
    
//     export default Request;

import {Request} from 'express';

interface UserRequest extends Request {
    headers: {
        authorization?: string;
    };
    user? : {
       id: number;
       role: string;
       name: string;
       phone: string;
    } | null;
}

export default UserRequest;
