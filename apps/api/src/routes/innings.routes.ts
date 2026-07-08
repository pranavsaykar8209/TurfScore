import { Router } from 'express';
import {
  getInnings,
  updateInnings,
  endInnings,
} from '../controllers/innings.controller';

const router = Router();

router.get('/:inningsId', getInnings);
router.patch('/:inningsId', updateInnings);
router.post('/:inningsId/end', endInnings);

export default router;
