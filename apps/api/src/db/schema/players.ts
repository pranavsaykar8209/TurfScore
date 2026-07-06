import { pgTable, serial, varchar, timestamp, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { teams } from './teams';

export const players = pgTable('players', {
  playerId: serial('player_id').primaryKey(),
  teamId: integer('team_id').references(() => teams.teamId, { onDelete: 'cascade' }).notNull(),
  playerName: varchar('player_name', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => ({
  teamIdIdx: index('players_team_id_idx').on(table.teamId),
}));

export const playersRelations = relations(players, ({ one }) => ({
  team: one(teams, {
    fields: [players.teamId],
    references: [teams.teamId],
  }),
}));
