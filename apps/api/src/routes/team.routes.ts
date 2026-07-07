import { Router } from 'express';
import {
  getTeam,
  updateTeam,
  deleteTeam,
} from '../controllers/team.controller';

const router = Router();

router.get('/:teamId', getTeam);
router.patch('/:teamId', updateTeam);
router.delete('/:teamId', deleteTeam);

export default router;
