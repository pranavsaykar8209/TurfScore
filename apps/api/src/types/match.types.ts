import { z } from 'zod';

export const createMatchSchema = z.object({
  teamAId: z.number().int().positive(),
  teamBId: z.number().int().positive(),
  oversPerInnings: z.number().int().positive(),
  tossWinnerTeamId: z.number().int().positive().optional(),
  tossDecision: z.enum(['bat', 'bowl']).optional(),
});

export const updateMatchSchema = z.object({
  status: z.enum(['scheduled', 'live', 'completed']).optional(),
  currentInning: z.number().int().positive().optional(),
  tossWinnerTeamId: z.number().int().positive().optional(),
  tossDecision: z.enum(['bat', 'bowl']).optional(),
  winnerTeamId: z.number().int().positive().optional(),
  winType: z.string().optional(),
  winMargin: z.number().int().optional(),
  startedAt: z.string().datetime().optional().or(z.date().optional()),
  completedAt: z.string().datetime().optional().or(z.date().optional()),
});

export type CreateMatchDto = z.infer<typeof createMatchSchema>;
export type UpdateMatchDto = z.infer<typeof updateMatchSchema>;
