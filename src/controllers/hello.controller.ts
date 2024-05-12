import { Request, Response } from 'express';

export const helloAuth = (req: Request, res: Response) => {
    res.status(200).send('Hello World, you have been authenticated!');
}

export const hello = (req: Request, res: Response) => {
    res.status(200).send('Hello World, no authentication needed!');
}