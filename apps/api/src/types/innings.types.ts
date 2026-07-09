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

export const syncPlayerStatsSchema = z.object({
  playerId: z.number().int().positive(),
  teamId: z.number().int().positive().optional(),
  runs: z.number().int().nonnegative().optional(),
  ballsFaced: z.number().int().nonnegative().optional(),
  fours: z.number().int().nonnegative().optional(),
  sixes: z.number().int().nonnegative().optional(),
  ballsBowled: z.number().int().nonnegative().optional(),
  maidens: z.number().int().nonnegative().optional(),
  runsConceded: z.number().int().nonnegative().optional(),
  wickets: z.number().int().nonnegative().optional(),
  wides: z.number().int().nonnegative().optional(),
  noBalls: z.number().int().nonnegative().optional(),
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
  playerStats: z.array(syncPlayerStatsSchema).optional(),
});

export type CreateInningsDto = z.infer<typeof createInningsSchema>;
export type UpdateInningsDto = z.infer<typeof updateInningsSchema>;
