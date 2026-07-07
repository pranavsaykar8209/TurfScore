import { Router } from 'express';
import {
  createSession,
  getSession,
  updateSession,
  getSessionDashboard,
} from '../controllers/session.controller';

const router = Router();

router.post('/', createSession);
router.get('/:sessionCode', getSession);
router.patch('/:sessionCode', updateSession);
router.get('/:sessionCode/dashboard', getSessionDashboard);

export default router;
