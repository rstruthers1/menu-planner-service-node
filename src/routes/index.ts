import {Router} from 'express';
import usersRouter from './users.routes';
import authRouter from './auth.routes';
import helloRouter from './hello.routes';


const router = Router();

router.use('/', helloRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/hello', helloRouter);


export default router;