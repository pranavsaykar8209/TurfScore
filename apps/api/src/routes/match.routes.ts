import { Router } from 'express';
import {
  getMatch,
  updateMatch,
  deleteMatch,
  getLiveScoringData,
} from '../controllers/match.controller';
import {
  startFirstInnings,
  getCurrentInnings,
  startSecondInnings,
} from '../controllers/innings.controller';

const router = Router();

router.get('/:matchId', getMatch);
router.get('/:matchId/live-scoring', getLiveScoringData);
router.patch('/:matchId', updateMatch);
router.delete('/:matchId', deleteMatch);

router.post('/:matchId/innings', startFirstInnings);
router.get('/:matchId/innings/current', getCurrentInnings);
router.post('/:matchId/innings/second', startSecondInnings);

export default router;
