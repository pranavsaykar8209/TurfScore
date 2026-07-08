import { Request, Response } from 'express';
import { z } from 'zod';
import { playerService } from '../services/player.service';
import { createPlayerSchema, updatePlayerSchema } from '../types/player.types';

export const createPlayer = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const data = createPlayerSchema.parse(req.body);
    
    const player = await playerService.createPlayer(sessionCode, data);
    res.status(201).json(player);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else if (error.message.includes('not found') || error.message.includes('belong')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getPlayers = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const teamId = req.query.teamId ? parseInt(req.query.teamId as string, 10) : undefined;
    
    const players = await playerService.getPlayers(sessionCode, teamId);
    res.status(200).json(players);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const getPlayer = async (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerId, 10);
    if (isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }
    
    const player = await playerService.getPlayer(playerId);
    res.status(200).json(player);
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const updatePlayer = async (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerId, 10);
    if (isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }
    
    const data = updatePlayerSchema.parse(req.body);
    const updatedPlayer = await playerService.updatePlayer(playerId, data);
    res.status(200).json(updatedPlayer);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else if (error.message.includes('not found') || error.message.includes('belong')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const deletePlayer = async (req: Request, res: Response) => {
  try {
    const playerId = parseInt(req.params.playerId, 10);
    if (isNaN(playerId)) {
      return res.status(400).json({ error: 'Invalid player ID' });
    }
    
    await playerService.deletePlayer(playerId);
    res.status(200).json({ message: 'Player deleted successfully' });
  } catch (error: any) {
    if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else if (error.message.includes('Cannot delete')) {
      res.status(409).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

export const syncPlayers = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const schema = z.array(createPlayerSchema);
    const data = schema.parse(req.body);
    
    const players = await playerService.syncPlayersForSession(sessionCode, data);
    res.status(200).json(players);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: error.issues });
    } else if (error.message.includes('not found')) {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};
