import { z } from 'zod';

export const updatePlayerStatsSchema = z.object({
  runs: z.number().int().min(0).optional(),
  ballsFaced: z.number().int().min(0).optional(),
  fours: z.number().int().min(0).optional(),
  sixes: z.number().int().min(0).optional(),
  ballsBowled: z.number().int().min(0).optional(),
  maidens: z.number().int().min(0).optional(),
  runsConceded: z.number().int().min(0).optional(),
  wickets: z.number().int().min(0).optional(),
  wides: z.number().int().min(0).optional(),
  noBalls: z.number().int().min(0).optional(),
});

export type UpdatePlayerStatsDto = z.infer<typeof updatePlayerStatsSchema>;

// Input for upserting stats internally
export interface UpsertPlayerStatsDto {
  playerId: number;
  matchId: number;
  inningId: number;
  teamId: number;
  runs?: number;
  ballsFaced?: number;
  fours?: number;
  sixes?: number;
  ballsBowled?: number;
  maidens?: number;
  runsConceded?: number;
  wickets?: number;
  wides?: number;
  noBalls?: number;
}
