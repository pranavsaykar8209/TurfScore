import { pgTable, serial, integer, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { matches } from './matches';
import { teams } from './teams';
import { balls } from './balls';
import { playerStats } from './player_stats';
import { players } from './players';

export const innings = pgTable('innings', {
  inningId: serial('inning_id').primaryKey(),
  matchId: integer('match_id').references(() => matches.matchId, { onDelete: 'cascade' }).notNull(),
  inningNumber: integer('inning_number').notNull(),
  battingTeamId: integer('batting_team_id').references(() => teams.teamId, { onDelete: 'cascade' }).notNull(),
  bowlingTeamId: integer('bowling_team_id').references(() => teams.teamId, { onDelete: 'cascade' }).notNull(),
  totalRuns: integer('total_runs').default(0).notNull(),
  totalWickets: integer('total_wickets').default(0).notNull(),
  totalExtras: integer('total_extras').default(0).notNull(),
  legalBalls: integer('legal_balls').default(0).notNull(),
  currentStrikerId: integer('current_striker_id').references(() => players.playerId, { onDelete: 'set null' }),
  currentNonStrikerId: integer('current_non_striker_id').references(() => players.playerId, { onDelete: 'set null' }),
  currentBowlerId: integer('current_bowler_id').references(() => players.playerId, { onDelete: 'set null' }),
  currentOverNumber: integer('current_over_number').default(0).notNull(),
}, (table) => ({
  matchIdIdx: index('innings_match_id_idx').on(table.matchId),
  battingTeamIdIdx: index('innings_batting_team_id_idx').on(table.battingTeamId),
  bowlingTeamIdIdx: index('innings_bowling_team_id_idx').on(table.bowlingTeamId),
  matchIdInningNumberUnq: unique('innings_match_id_inning_number_unq').on(table.matchId, table.inningNumber),
}));

export const inningsRelations = relations(innings, ({ one, many }) => ({
  match: one(matches, {
    fields: [innings.matchId],
    references: [matches.matchId],
  }),
  battingTeam: one(teams, {
    fields: [innings.battingTeamId],
    references: [teams.teamId],
  }),
  bowlingTeam: one(teams, {
    fields: [innings.bowlingTeamId],
    references: [teams.teamId],
  }),
  currentStriker: one(players, {
    fields: [innings.currentStrikerId],
    references: [players.playerId],
  }),
  currentNonStriker: one(players, {
    fields: [innings.currentNonStrikerId],
    references: [players.playerId],
  }),
  currentBowler: one(players, {
    fields: [innings.currentBowlerId],
    references: [players.playerId],
  }),
  balls: many(balls),
  playerStats: many(playerStats),
}));
