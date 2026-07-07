import { Router } from 'express';
import { getHome } from '../controllers/home.controller';
import sessionRoutes from './session.routes';

const router = Router();

router.get('/', getHome);
router.use('/api/sessions', sessionRoutes);

export default router;
