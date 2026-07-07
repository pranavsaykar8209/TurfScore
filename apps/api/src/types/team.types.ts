import { z } from 'zod';

export const createTeamSchema = z.object({
  teamName: z.string().min(1, 'Team name is required').max(255, 'Team name is too long'),
});

export const updateTeamSchema = z.object({
  teamName: z.string().min(1, 'Team name is required').max(255, 'Team name is too long'),
});

export type CreateTeamDto = z.infer<typeof createTeamSchema>;
export type UpdateTeamDto = z.infer<typeof updateTeamSchema>;
