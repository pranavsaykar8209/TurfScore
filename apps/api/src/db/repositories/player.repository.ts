import { eq, and, inArray } from 'drizzle-orm';
import { db } from '../index';
import { players } from '../schema/players';
import { teams } from '../schema/teams';
import { sessions } from '../schema/sessions';
import { playerStats } from '../schema/player_stats';
import { CreatePlayerDto, UpdatePlayerDto } from '../../types/player.types';

export class PlayerRepository {
  async create(teamId: number, data: CreatePlayerDto) {
    const [newPlayer] = await db
      .insert(players)
      .values({
        teamId,
        playerName: data.playerName,
      })
      .returning();
    return newPlayer;
  }

  async createMany(data: { teamId: number, playerName: string }[]) {
    if (data.length === 0) return [];
    
    return await db
      .insert(players)
      .values(data)
      .returning();
  }

  async findBySessionCode(sessionCode: string, teamId?: number) {
    const query = db
      .select({
        playerId: players.playerId,
        teamId: players.teamId,
        playerName: players.playerName,
        createdAt: players.createdAt,
      })
      .from(players)
      .innerJoin(teams, eq(players.teamId, teams.teamId))
      .innerJoin(sessions, eq(teams.sessionId, sessions.sessionId))
      .where(
        and(
          eq(sessions.sessionCode, sessionCode),
          teamId ? eq(players.teamId, teamId) : undefined
        )
      );

    return await query;
  }

  async findById(playerId: number) {
    const [player] = await db
      .select()
      .from(players)
      .where(eq(players.playerId, playerId));
    return player;
  }

  async update(playerId: number, data: UpdatePlayerDto) {
    const [updatedPlayer] = await db
      .update(players)
      .set({
        ...(data.teamId && { teamId: data.teamId }),
        ...(data.playerName && { playerName: data.playerName }),
      })
      .where(eq(players.playerId, playerId))
      .returning();
    return updatedPlayer;
  }

  async delete(playerId: number) {
    await db
      .delete(players)
      .where(eq(players.playerId, playerId));
  }

  async deleteBySessionCode(sessionCode: string) {
    // To delete all players for a session, we first get their IDs
    const sessionPlayers = await this.findBySessionCode(sessionCode);
    if (sessionPlayers.length === 0) return;

    const playerIds = sessionPlayers.map(p => p.playerId);

    await db
      .delete(players)
      .where(inArray(players.playerId, playerIds));
  }

  async countPlayerStats(playerId: number): Promise<number> {
    const stats = await db
      .select()
      .from(playerStats)
      .where(eq(playerStats.playerId, playerId));
    return stats.length;
  }
}
