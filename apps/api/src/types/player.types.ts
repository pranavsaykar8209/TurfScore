import { z } from 'zod';

export const createPlayerSchema = z.object({
  teamId: z.number().int().positive('Team ID must be a positive integer'),
  playerName: z.string().min(1, 'Player name is required').max(255, 'Player name is too long'),
});

export const updatePlayerSchema = z.object({
  teamId: z.number().int().positive('Team ID must be a positive integer').optional(),
  playerName: z.string().min(1, 'Player name cannot be empty').max(255, 'Player name is too long').optional(),
}).refine(data => data.teamId !== undefined || data.playerName !== undefined, {
  message: 'At least one field (teamId or playerName) must be provided for update',
});

export type CreatePlayerDto = z.infer<typeof createPlayerSchema>;
export type UpdatePlayerDto = z.infer<typeof updatePlayerSchema>;
