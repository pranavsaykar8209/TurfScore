import { pgTable, serial, varchar, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sessions } from './sessions';
import { players } from './players';
import { matches } from './matches';

export const teams = pgTable('teams', {
  teamId: serial('team_id').primaryKey(),
  sessionId: integer('session_id').references(() => sessions.sessionId, { onDelete: 'cascade' }).notNull(),
  teamName: varchar('team_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  sessionIdIdx: index('teams_session_id_idx').on(table.sessionId),
}));

export const teamsRelations = relations(teams, ({ one, many }) => ({
  session: one(sessions, {
    fields: [teams.sessionId],
    references: [sessions.sessionId],
  }),
  players: many(players),
  matchesAsTeamA: many(matches, { relationName: 'teamA' }),
  matchesAsTeamB: many(matches, { relationName: 'teamB' }),
}));
