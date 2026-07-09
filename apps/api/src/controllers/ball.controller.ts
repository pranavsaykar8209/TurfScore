import { Request, Response } from 'express';
import { BallService } from '../services/ball.service';
import { recordBallSchema } from '../types/ball.types';
import { z } from 'zod';

const ballService = new BallService();

export const recordBall = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const data = recordBallSchema.parse(req.body);
    const result = await ballService.recordBall(parseInt(matchId), data);
    res.status(201).json(result);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('not live') || error.message.includes('cannot be')) {
      return res.status(409).json({ error: error.message });
    }
    console.error('Error in recordBall:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

export const undoLastBall = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const result = await ballService.undoLastBall(parseInt(matchId));
    res.status(200).json(result);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('No balls')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
