import { Request, Response } from 'express';
import { MatchService } from '../services/match.service';
import { createMatchSchema, updateMatchSchema } from '../types/match.types';
import { z } from 'zod';

const matchService = new MatchService();

export const createMatch = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const data = createMatchSchema.parse(req.body);
    const match = await matchService.createMatch(sessionCode, data);
    res.status(201).json(match);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Team A and Team B must be different' || error.message.includes('not found in this session') || error.message.includes('Toss winner must be one of')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMatches = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const matches = await matchService.getMatches(sessionCode);
    res.status(200).json(matches);
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMatch = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const match = await matchService.getMatch(parseInt(matchId));
    res.status(200).json(match);
  } catch (error: any) {
    if (error.message === 'Match not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateMatch = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const data = updateMatchSchema.parse(req.body);
    const updatedMatch = await matchService.updateMatch(parseInt(matchId), data);
    res.status(200).json(updatedMatch);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error.message === 'Match not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('must be one of the participating teams')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteMatch = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    await matchService.deleteMatch(parseInt(matchId));
    res.status(200).json({ message: 'Match deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Match not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Cannot delete a match that has already started') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
