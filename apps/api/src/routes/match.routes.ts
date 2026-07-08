import { Router } from 'express';
import {
  getMatch,
  updateMatch,
  deleteMatch,
} from '../controllers/match.controller';

const router = Router();

router.get('/:matchId', getMatch);
router.patch('/:matchId', updateMatch);
router.delete('/:matchId', deleteMatch);

export default router;
