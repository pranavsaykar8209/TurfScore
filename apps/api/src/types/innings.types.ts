import { z } from 'zod';

export const createInningsSchema = z.object({
  matchId: z.number().int().positive(),
  inningNumber: z.number().int().positive(),
  battingTeamId: z.number().int().positive(),
  bowlingTeamId: z.number().int().positive(),
  currentStrikerId: z.number().int().positive().nullable().optional(),
  currentNonStrikerId: z.number().int().positive().nullable().optional(),
  currentBowlerId: z.number().int().positive().nullable().optional(),
  currentOverNumber: z.number().int().nonnegative().default(0).optional(),
});

export const updateInningsSchema = z.object({
  totalRuns: z.number().int().nonnegative().optional(),
  totalWickets: z.number().int().nonnegative().optional(),
  totalExtras: z.number().int().nonnegative().optional(),
  legalBalls: z.number().int().nonnegative().optional(),
  currentStrikerId: z.number().int().positive().nullable().optional(),
  currentNonStrikerId: z.number().int().positive().nullable().optional(),
  currentBowlerId: z.number().int().positive().nullable().optional(),
  currentOverNumber: z.number().int().nonnegative().optional(),
});

export type CreateInningsDto = z.infer<typeof createInningsSchema>;
export type UpdateInningsDto = z.infer<typeof updateInningsSchema>;
