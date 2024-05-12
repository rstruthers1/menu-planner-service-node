// auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: any;  // Define more specific type based on your application needs
}

export const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies['token'];  // Assumes your cookie's name is 'token'
        if (!token) {
            return res.status(401).send('Access denied. No token provided.');
        }

        req.user = jwt.verify(token, process.env.JWT_SECRET as string);
        next();
    } catch (error) {
        res.status(400).send('Invalid token.');
    }
};
