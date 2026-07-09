import { Request, Response } from 'express';
import { PlayerStatsService } from '../services/player-stats.service';

const playerStatsService = new PlayerStatsService();

export const getMatchScorecard = async (req: Request, res: Response) => {
  try {
    const { matchId } = req.params;
    const stats = await playerStatsService.getMatchScorecard(parseInt(matchId));
    res.status(200).json(stats);
  } catch (error: any) {
    if (error.message === 'Match not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSessionStats = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const stats = await playerStatsService.getSessionStats(sessionCode);
    res.status(200).json(stats);
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLeaderboards = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const leaderboards = await playerStatsService.getLeaderboards(sessionCode);
    res.status(200).json(leaderboards);
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
