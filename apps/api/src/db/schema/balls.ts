import { pgTable, serial, integer, boolean, pgEnum, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { innings } from './innings';
import { players } from './players';

export const extraTypeEnum = pgEnum('extra_type', ['wide', 'no_ball', 'bye', 'leg_bye']);

export const balls = pgTable('balls', {
  ballId: serial('ball_id').primaryKey(),
  inningId: integer('inning_id').references(() => innings.inningId, { onDelete: 'cascade' }).notNull(),
  overNumber: integer('over_number').notNull(),
  ballNumber: integer('ball_number').notNull(),
  strikerId: integer('striker_id').references(() => players.playerId, { onDelete: 'cascade' }).notNull(),
  nonStrikerId: integer('non_striker_id').references(() => players.playerId, { onDelete: 'cascade' }).notNull(),
  bowlerId: integer('bowler_id').references(() => players.playerId, { onDelete: 'cascade' }).notNull(),
  runsOffBat: integer('runs_off_bat').default(0).notNull(),
  extraType: extraTypeEnum('extra_type'),
  extraRuns: integer('extra_runs').default(0).notNull(),
  isLegalBall: boolean('is_legal_ball').default(true).notNull(),
  isWicket: boolean('is_wicket').default(false).notNull(),
  dismissedPlayerId: integer('dismissed_player_id').references(() => players.playerId, { onDelete: 'set null' }),
}, (table) => ({
  inningIdIdx: index('balls_inning_id_idx').on(table.inningId),
  strikerIdIdx: index('balls_striker_id_idx').on(table.strikerId),
  nonStrikerIdIdx: index('balls_non_striker_id_idx').on(table.nonStrikerId),
  bowlerIdIdx: index('balls_bowler_id_idx').on(table.bowlerId),
  dismissedPlayerIdIdx: index('balls_dismissed_player_id_idx').on(table.dismissedPlayerId),
  inningOverBallUnq: unique('balls_inning_over_ball_unq').on(table.inningId, table.overNumber, table.ballNumber),
}));

export const ballsRelations = relations(balls, ({ one }) => ({
  inning: one(innings, {
    fields: [balls.inningId],
    references: [innings.inningId],
  }),
  striker: one(players, {
    fields: [balls.strikerId],
    references: [players.playerId],
    relationName: 'striker',
  }),
  nonStriker: one(players, {
    fields: [balls.nonStrikerId],
    references: [players.playerId],
    relationName: 'nonStriker',
  }),
  bowler: one(players, {
    fields: [balls.bowlerId],
    references: [players.playerId],
    relationName: 'bowler',
  }),
  dismissedPlayer: one(players, {
    fields: [balls.dismissedPlayerId],
    references: [players.playerId],
    relationName: 'dismissedPlayer',
  }),
}));
