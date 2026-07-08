import { Router } from 'express';
import { getHome } from '../controllers/home.controller';
import sessionRoutes from './session.routes';
import teamRoutes from './team.routes';
import playerRoutes from './player.routes';
import matchRoutes from './match.routes';

const router = Router();

router.get('/', getHome);
router.use('/api/sessions', sessionRoutes);
router.use('/api/teams', teamRoutes);
router.use('/api/players', playerRoutes);
router.use('/api/matches', matchRoutes);

export default router;
