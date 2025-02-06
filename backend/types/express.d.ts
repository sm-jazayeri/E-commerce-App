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
