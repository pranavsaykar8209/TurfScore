import { Request, Response } from 'express';
import { InningsService } from '../services/innings.service';
import { updateInningsSchema } from '../types/innings.types';
import { z } from 'zod';

const inningsService = new InningsService();

export const startFirstInnings = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const innings = await inningsService.startFirstInnings(parseInt(matchId));
    res.status(201).json(innings);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('already started') || error.message.includes('must be scheduled or live')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCurrentInnings = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const innings = await inningsService.getCurrentInnings(parseInt(matchId));
    res.status(200).json(innings);
  } catch (error: any) {
    if (error.message.includes('not found') || error.message.includes('No active innings')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getInnings = async (req: Request, res: Response) => {
  try {
    const { inningsId } = req.params;
    const innings = await inningsService.getInnings(parseInt(inningsId));
    res.status(200).json(innings);
  } catch (error: any) {
    if (error.message === 'Innings not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateInnings = async (req: Request, res: Response) => {
  try {
    const { inningsId } = req.params;
    const data = updateInningsSchema.parse(req.body);
    const updatedInnings = await inningsService.updateInnings(parseInt(inningsId), data);
    res.status(200).json(updatedInnings);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error.message === 'Innings not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const endInnings = async (req: Request, res: Response) => {
  try {
    const { inningsId } = req.params;
    const innings = await inningsService.endInnings(parseInt(inningsId));
    res.status(200).json(innings);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const startSecondInnings = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const innings = await inningsService.startSecondInnings(parseInt(matchId));
    res.status(201).json(innings);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('already started')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
