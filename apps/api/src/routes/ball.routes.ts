import { Router } from 'express';
import { recordBall, undoLastBall } from '../controllers/ball.controller';

const router = Router();

// These routes will be mounted on /api/matches
router.post('/:matchId/ball', recordBall);
router.delete('/:matchId/ball/last', undoLastBall);

export default router;
