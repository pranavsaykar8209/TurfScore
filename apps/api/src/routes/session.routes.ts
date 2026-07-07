import { Router } from 'express';
import {
  createSession,
  getSession,
  updateSession,
  getSessionDashboard,
} from '../controllers/session.controller';
import { createTeam, getTeams } from '../controllers/team.controller';

const router = Router();

router.post('/', createSession);
router.get('/:sessionCode', getSession);
router.patch('/:sessionCode', updateSession);
router.get('/:sessionCode/dashboard', getSessionDashboard);

router.post('/:sessionCode/teams', createTeam);
router.get('/:sessionCode/teams', getTeams);

export default router;
