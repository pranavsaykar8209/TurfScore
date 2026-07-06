import { pgTable, serial, varchar, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { teams } from './teams';
import { matches } from './matches';

export const sessionStatusEnum = pgEnum('session_status', ['active', 'completed']);

export const sessions = pgTable('sessions', {
  sessionId: serial('session_id').primaryKey(),
  sessionCode: varchar('session_code', { length: 255 }).unique().notNull(),
  sessionName: varchar('session_name', { length: 255 }).notNull(),
  status: sessionStatusEnum('status').default('active').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull(),
});

export const sessionsRelations = relations(sessions, ({ many }) => ({
  teams: many(teams),
  matches: many(matches),
}));
