import { eq, and, sql } from 'drizzle-orm';
import { db } from '../index';
import { playerStats } from '../schema/player_stats';
import { matches } from '../schema/matches';
import { players } from '../schema/players';
import { UpsertPlayerStatsDto } from '../../types/player-stats.types';

export class PlayerStatsRepository {
  async getByMatchId(matchId: number) {
    return await db.query.playerStats.findMany({
      where: eq(playerStats.matchId, matchId),
      with: {
        player: true,
        team: true,
        inning: true,
      },
    });
  }

  async getBySessionId(sessionId: number) {
    // We need to get stats for all matches in a session
    // Drizzle's relational queries might not filter nested cleanly, so we can use a query builder with joins
    // Or just fetch all matches for the session, then fetch stats for those matches.
    const sessionMatches = await db.query.matches.findMany({
      where: eq(matches.sessionId, sessionId),
      columns: { matchId: true },
    });

    if (!sessionMatches.length) return [];

    const matchIds = sessionMatches.map(m => m.matchId);
    
    // Instead of using inArray, let's just do a join using query builder to aggregate stats per player
    const stats = await db
      .select({
        playerId: playerStats.playerId,
        playerName: players.playerName,
        teamId: playerStats.teamId,
        runs: sql<number>`SUM(${playerStats.runs})::int`,
        ballsFaced: sql<number>`SUM(${playerStats.ballsFaced})::int`,
        fours: sql<number>`SUM(${playerStats.fours})::int`,
        sixes: sql<number>`SUM(${playerStats.sixes})::int`,
        ballsBowled: sql<number>`SUM(${playerStats.ballsBowled})::int`,
        maidens: sql<number>`SUM(${playerStats.maidens})::int`,
        runsConceded: sql<number>`SUM(${playerStats.runsConceded})::int`,
        wickets: sql<number>`SUM(${playerStats.wickets})::int`,
        wides: sql<number>`SUM(${playerStats.wides})::int`,
        noBalls: sql<number>`SUM(${playerStats.noBalls})::int`,
      })
      .from(playerStats)
      .innerJoin(matches, eq(playerStats.matchId, matches.matchId))
      .innerJoin(players, eq(playerStats.playerId, players.playerId))
      .where(eq(matches.sessionId, sessionId))
      .groupBy(playerStats.playerId, players.playerName, playerStats.teamId);

    // We can also fetch player details
    // But since the frontend might need player names, we can join players table
    return stats;
  }

  async upsert(data: UpsertPlayerStatsDto, tx: any = db) {
    const existing = await tx.query.playerStats.findFirst({
      where: and(
        eq(playerStats.playerId, data.playerId),
        eq(playerStats.matchId, data.matchId),
        eq(playerStats.inningId, data.inningId)
      )
    });

    if (existing) {
      const [updated] = await tx
        .update(playerStats)
        .set({
          runs: data.runs !== undefined ? existing.runs + data.runs : existing.runs,
          ballsFaced: data.ballsFaced !== undefined ? existing.ballsFaced + data.ballsFaced : existing.ballsFaced,
          fours: data.fours !== undefined ? existing.fours + data.fours : existing.fours,
          sixes: data.sixes !== undefined ? existing.sixes + data.sixes : existing.sixes,
          ballsBowled: data.ballsBowled !== undefined ? existing.ballsBowled + data.ballsBowled : existing.ballsBowled,
          maidens: data.maidens !== undefined ? existing.maidens + data.maidens : existing.maidens,
          runsConceded: data.runsConceded !== undefined ? existing.runsConceded + data.runsConceded : existing.runsConceded,
          wickets: data.wickets !== undefined ? existing.wickets + data.wickets : existing.wickets,
          wides: data.wides !== undefined ? existing.wides + data.wides : existing.wides,
          noBalls: data.noBalls !== undefined ? existing.noBalls + data.noBalls : existing.noBalls,
        })
        .where(eq(playerStats.playerStatsId, existing.playerStatsId))
        .returning();
      return updated;
    } else {
      const [inserted] = await tx
        .insert(playerStats)
        .values({
          playerId: data.playerId,
          matchId: data.matchId,
          inningId: data.inningId,
          teamId: data.teamId,
          runs: data.runs || 0,
          ballsFaced: data.ballsFaced || 0,
          fours: data.fours || 0,
          sixes: data.sixes || 0,
          ballsBowled: data.ballsBowled || 0,
          maidens: data.maidens || 0,
          runsConceded: data.runsConceded || 0,
          wickets: data.wickets || 0,
          wides: data.wides || 0,
          noBalls: data.noBalls || 0,
        })
        .returning();
      return inserted;
    }
  }

  async sync(data: UpsertPlayerStatsDto, tx: any = db) {
    const existing = await tx.query.playerStats.findFirst({
      where: and(
        eq(playerStats.playerId, data.playerId),
        eq(playerStats.matchId, data.matchId),
        eq(playerStats.inningId, data.inningId)
      )
    });

    if (existing) {
      const [updated] = await tx
        .update(playerStats)
        .set({
          runs: data.runs !== undefined ? data.runs : existing.runs,
          ballsFaced: data.ballsFaced !== undefined ? data.ballsFaced : existing.ballsFaced,
          fours: data.fours !== undefined ? data.fours : existing.fours,
          sixes: data.sixes !== undefined ? data.sixes : existing.sixes,
          ballsBowled: data.ballsBowled !== undefined ? data.ballsBowled : existing.ballsBowled,
          maidens: data.maidens !== undefined ? data.maidens : existing.maidens,
          runsConceded: data.runsConceded !== undefined ? data.runsConceded : existing.runsConceded,
          wickets: data.wickets !== undefined ? data.wickets : existing.wickets,
          wides: data.wides !== undefined ? data.wides : existing.wides,
          noBalls: data.noBalls !== undefined ? data.noBalls : existing.noBalls,
        })
        .where(eq(playerStats.playerStatsId, existing.playerStatsId))
        .returning();
      return updated;
    } else {
      const [inserted] = await tx
        .insert(playerStats)
        .values({
          playerId: data.playerId,
          matchId: data.matchId,
          inningId: data.inningId,
          teamId: data.teamId,
          runs: data.runs || 0,
          ballsFaced: data.ballsFaced || 0,
          fours: data.fours || 0,
          sixes: data.sixes || 0,
          ballsBowled: data.ballsBowled || 0,
          maidens: data.maidens || 0,
          runsConceded: data.runsConceded || 0,
          wickets: data.wickets || 0,
          wides: data.wides || 0,
          noBalls: data.noBalls || 0,
        })
        .returning();
      return inserted;
    }
  }

  async syncMany(dataArray: any[], tx: any = db) {
    if (dataArray.length === 0) return;
    
    await tx
      .insert(playerStats)
      .values(dataArray)
      .onConflictDoUpdate({
        target: [playerStats.playerId, playerStats.matchId, playerStats.inningId],
        set: {
          runs: sql`EXCLUDED.runs`,
          ballsFaced: sql`EXCLUDED.balls_faced`,
          fours: sql`EXCLUDED.fours`,
          sixes: sql`EXCLUDED.sixes`,
          ballsBowled: sql`EXCLUDED.balls_bowled`,
          maidens: sql`EXCLUDED.maidens`,
          runsConceded: sql`EXCLUDED.runs_conceded`,
          wickets: sql`EXCLUDED.wickets`,
          wides: sql`EXCLUDED.wides`,
          noBalls: sql`EXCLUDED.no_balls`,
        }
      });
  }
}
