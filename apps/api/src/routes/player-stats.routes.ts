import { Router } from 'express';
import { getMatchScorecard, getSessionStats, getLeaderboards } from '../controllers/player-stats.controller';

const router = Router();

router.get('/match/:matchId', getMatchScorecard);
router.get('/session/:sessionCode', getSessionStats);
router.get('/session/:sessionCode/leaderboards', getLeaderboards);

export default router;
