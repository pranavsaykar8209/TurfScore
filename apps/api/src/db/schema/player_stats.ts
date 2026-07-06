import { pgTable, serial, integer, index, unique } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { players } from './players';
import { matches } from './matches';
import { innings } from './innings';
import { teams } from './teams';

export const playerStats = pgTable('player_stats', {
  playerStatsId: serial('player_stats_id').primaryKey(),
  playerId: integer('player_id').references(() => players.playerId, { onDelete: 'cascade' }).notNull(),
  matchId: integer('match_id').references(() => matches.matchId, { onDelete: 'cascade' }).notNull(),
  inningId: integer('inning_id').references(() => innings.inningId, { onDelete: 'cascade' }).notNull(),
  teamId: integer('team_id').references(() => teams.teamId, { onDelete: 'cascade' }).notNull(),
  runs: integer('runs').default(0).notNull(),
  ballsFaced: integer('balls_faced').default(0).notNull(),
  fours: integer('fours').default(0).notNull(),
  sixes: integer('sixes').default(0).notNull(),
  ballsBowled: integer('balls_bowled').default(0).notNull(),
  maidens: integer('maidens').default(0).notNull(),
  runsConceded: integer('runs_conceded').default(0).notNull(),
  wickets: integer('wickets').default(0).notNull(),
  wides: integer('wides').default(0).notNull(),
  noBalls: integer('no_balls').default(0).notNull(),
}, (table) => ({
  playerIdIdx: index('player_stats_player_id_idx').on(table.playerId),
  matchIdIdx: index('player_stats_match_id_idx').on(table.matchId),
  inningIdIdx: index('player_stats_inning_id_idx').on(table.inningId),
  teamIdIdx: index('player_stats_team_id_idx').on(table.teamId),
  playerMatchInningUnq: unique('player_stats_player_match_inning_unq').on(table.playerId, table.matchId, table.inningId),
}));

export const playerStatsRelations = relations(playerStats, ({ one }) => ({
  player: one(players, {
    fields: [playerStats.playerId],
    references: [players.playerId],
  }),
  match: one(matches, {
    fields: [playerStats.matchId],
    references: [matches.matchId],
  }),
  inning: one(innings, {
    fields: [playerStats.inningId],
    references: [innings.inningId],
  }),
  team: one(teams, {
    fields: [playerStats.teamId],
    references: [teams.teamId],
  }),
}));
