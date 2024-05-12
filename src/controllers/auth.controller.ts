import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Adjust the import path according to your project structure

function generateDuplicateFieldMessage(keyPattern: Record<string, number>): string {
    const fields = Object.keys(keyPattern);
    const fieldNames = fields.map(field =>
        `${field.charAt(0).toUpperCase() + field.slice(1)}`
    ).join(" and ");
    return `${fieldNames} already exist${fields.length > 1 ? '' : 's'}.`;
}

// Function to handle user registration
export const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword
        });

        const savedUser =  await newUser.save();
        res.status(201).send({
            success: true,
            user:
                {
                    username: savedUser.username,
                    email: savedUser.email,
                    id: savedUser._id
                }
        });
    } catch (error: any) {
        console.error(error);
        if (typeof error === 'object' && 'code' in error && error.code === 11000 &&
            'keyPattern' in error) {
            const message = generateDuplicateFieldMessage(error.keyPattern);
            res.status(400).send({
                success: false,
                message: message
            })

        } else {
            res.status(500).send({
                success: false,
                message: 'error registering user'
            });
        }
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        console.error('JWT secret is not defined');
        return res.status(401).send({
            success: false,
            message: 'Invalid JWT secret.'
        })
    }
    try {
        const user = await User.findOne({email});
        if (user === null) {
            return res.status(401).send({
                success: false,
                message: 'Invalid email or password'
            })

        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
           return  res.status(401).send({
                success: false,
                message: 'Invalid email or password'
            })
        }
        const token = jwt.sign(
            {userId: user._id,
            email: user.email},
            jwtSecret,
            {expiresIn: '1h'})
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // use secure flag in production
            sameSite: 'strict', // helps mitigate CSRF attacks
            maxAge: 3600000 // cookie expiry, should match token expiry
        });
        res.json({
                id: user._id,
                email: user.email
        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};