import { Router } from 'express';
import {
  getPlayer,
  updatePlayer,
  deletePlayer,
} from '../controllers/player.controller';

const router = Router();

router.get('/:playerId', getPlayer);
router.patch('/:playerId', updatePlayer);
router.delete('/:playerId', deletePlayer);

export default router;
