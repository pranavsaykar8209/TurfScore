import { pgTable, serial, varchar, timestamp, integer, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sessions } from './sessions';
import { teams } from './teams';
import { innings } from './innings';
import { playerStats } from './player_stats';

export const tossDecisionEnum = pgEnum('toss_decision', ['bat', 'bowl']);
export const matchStatusEnum = pgEnum('match_status', ['scheduled', 'live', 'completed']);

export const matches = pgTable('matches', {
  matchId: serial('match_id').primaryKey(),
  sessionId: integer('session_id').references(() => sessions.sessionId, { onDelete: 'cascade' }).notNull(),
  teamAId: integer('team_a_id').references(() => teams.teamId, { onDelete: 'cascade' }).notNull(),
  teamBId: integer('team_b_id').references(() => teams.teamId, { onDelete: 'cascade' }).notNull(),
  oversPerInnings: integer('overs_per_innings').notNull(),
  tossWinnerTeamId: integer('toss_winner_team_id').references(() => teams.teamId, { onDelete: 'set null' }),
  tossDecision: tossDecisionEnum('toss_decision'),
  currentInning: integer('current_inning').default(1),
  status: matchStatusEnum('status').default('scheduled').notNull(),
  winnerTeamId: integer('winner_team_id').references(() => teams.teamId, { onDelete: 'set null' }),
  winType: varchar('win_type', { length: 50 }),
  winMargin: integer('win_margin'),
  startedAt: timestamp('started_at', { mode: 'date' }),
  completedAt: timestamp('completed_at', { mode: 'date' }),
}, (table) => ({
  sessionIdIdx: index('matches_session_id_idx').on(table.sessionId),
  teamAIdIdx: index('matches_team_a_id_idx').on(table.teamAId),
  teamBIdIdx: index('matches_team_b_id_idx').on(table.teamBId),
  tossWinnerTeamIdIdx: index('matches_toss_winner_team_id_idx').on(table.tossWinnerTeamId),
  winnerTeamIdIdx: index('matches_winner_team_id_idx').on(table.winnerTeamId),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  session: one(sessions, {
    fields: [matches.sessionId],
    references: [sessions.sessionId],
  }),
  teamA: one(teams, {
    fields: [matches.teamAId],
    references: [teams.teamId],
    relationName: 'teamA',
  }),
  teamB: one(teams, {
    fields: [matches.teamBId],
    references: [teams.teamId],
    relationName: 'teamB',
  }),
  tossWinnerTeam: one(teams, {
    fields: [matches.tossWinnerTeamId],
    references: [teams.teamId],
    relationName: 'tossWinner',
  }),
  winnerTeam: one(teams, {
    fields: [matches.winnerTeamId],
    references: [teams.teamId],
    relationName: 'winner',
  }),
  innings: many(innings),
  playerStats: many(playerStats),
}));
