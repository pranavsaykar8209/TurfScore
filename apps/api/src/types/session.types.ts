import { z } from 'zod';

export const createSessionSchema = z.object({
  sessionCode: z.string().optional(),
  sessionName: z.string().optional(),
});

export const updateSessionSchema = z.object({
  sessionName: z.string().min(1, 'Session name is required'),
});

export type CreateSessionDto = z.infer<typeof createSessionSchema>;
export type UpdateSessionDto = z.infer<typeof updateSessionSchema>;
