import { Request, Response } from 'express';
import { TeamService } from '../services/team.service';
import { createTeamSchema, updateTeamSchema } from '../types/team.types';
import { z } from 'zod';

const teamService = new TeamService();

export const createTeam = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const data = createTeamSchema.parse(req.body);
    const team = await teamService.createTeam(sessionCode, data);
    res.status(201).json(team);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Team name must be unique within a session') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTeams = async (req: Request, res: Response) => {
  try {
    const { sessionCode } = req.params;
    const teams = await teamService.getTeams(sessionCode);
    res.status(200).json(teams);
  } catch (error: any) {
    if (error.message === 'Session not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const team = await teamService.getTeam(Number(teamId));
    res.status(200).json(team);
  } catch (error: any) {
    if (error.message === 'Team not found') {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    const data = updateTeamSchema.parse(req.body);
    const team = await teamService.updateTeam(Number(teamId), data);
    res.status(200).json(team);
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }
    if (error.message === 'Team not found') {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === 'Team name must be unique within a session') {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteTeam = async (req: Request, res: Response) => {
  try {
    const { teamId } = req.params;
    await teamService.deleteTeam(Number(teamId));
    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error: any) {
    if (error.message === 'Team not found') {
      return res.status(404).json({ error: error.message });
    }
    if (
      error.message === 'Cannot delete team with assigned players' ||
      error.message === 'Cannot delete team that has participated in a match'
    ) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};
