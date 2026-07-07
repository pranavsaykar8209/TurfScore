import { Request, Response } from 'express';
import { SessionService } from '../services/session.service';
import { createSessionSchema, updateSessionSchema } from '../types/session.types';
import { z } from 'zod';

const sessionService = new SessionService();

export const createSession = async (req: Request, res: Response) => {
  try {
    const data = createSessionSchema.parse(req.body);
    const session = await sessionService.createSession(data);
    res.status(201).json(session);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSession = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const session = await sessionService.getSession(sessionCode);
    res.status(200).json(session);
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSession = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const data = updateSessionSchema.parse(req.body);
    const session = await sessionService.updateSession(sessionCode, data);
    res.status(200).json(session);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getSessionDashboard = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const dashboard = await sessionService.getDashboard(sessionCode);
    res.status(200).json(dashboard);
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
