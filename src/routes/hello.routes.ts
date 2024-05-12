import express, {Router, Request, Response} from 'express';
import {auth} from '../middleware/auth.middleware'
import {hello, helloAuth} from '../controllers/hello.controller';

const router = Router();

router.get('/noAuth', hello);
router.get('/auth', auth, helloAuth);

export default router;
