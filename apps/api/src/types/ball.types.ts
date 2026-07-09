import { z } from 'zod';

export const extraTypeZod = z.enum(['wide', 'no_ball', 'bye', 'leg_bye']);

export const recordBallSchema = z.object({
  strikerId: z.number().int().positive(),
  nonStrikerId: z.number().int().positive(),
  bowlerId: z.number().int().positive(),
  runsOffBat: z.number().int().min(0),
  extraType: extraTypeZod.nullable().optional(),
  extraRuns: z.number().int().min(0),
  isLegalBall: z.boolean(),
  isWicket: z.boolean(),
  dismissedPlayerId: z.number().int().positive().nullable().optional(),
});

export type RecordBallDto = z.infer<typeof recordBallSchema>;
