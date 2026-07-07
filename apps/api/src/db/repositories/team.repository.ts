import { eq, and } from 'drizzle-orm';
import { db } from '../index';
import { teams } from '../schema/teams';
import { players } from '../schema/players';
import { matches } from '../schema/matches';
import { CreateTeamDto, UpdateTeamDto } from '../../types/team.types';

export class TeamRepository {
  async create(sessionId: number, data: CreateTeamDto) {
    const [newTeam] = await db
      .insert(teams)
      .values({
        sessionId,
        teamName: data.teamName,
      })
      .returning();
    return newTeam;
  }

  async findBySessionId(sessionId: number) {
    const sessionTeams = await db
      .select()
      .from(teams)
      .where(eq(teams.sessionId, sessionId));
    return sessionTeams;
  }

  async findById(teamId: number) {
    const [team] = await db
      .select()
      .from(teams)
      .where(eq(teams.teamId, teamId));
    return team;
  }

  async findByNameAndSession(teamName: string, sessionId: number) {
    const [team] = await db
      .select()
      .from(teams)
      .where(and(eq(teams.teamName, teamName), eq(teams.sessionId, sessionId)));
    return team;
  }

  async update(teamId: number, data: UpdateTeamDto) {
    const [updatedTeam] = await db
      .update(teams)
      .set({
        teamName: data.teamName,
      })
      .where(eq(teams.teamId, teamId))
      .returning();
    return updatedTeam;
  }

  async delete(teamId: number) {
    await db
      .delete(teams)
      .where(eq(teams.teamId, teamId));
  }

  async countPlayersInTeam(teamId: number): Promise<number> {
    const teamPlayers = await db
      .select()
      .from(players)
      .where(eq(players.teamId, teamId));
    return teamPlayers.length;
  }

  async countMatchesForTeam(teamId: number): Promise<number> {
    const teamMatches = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.teamAId, teamId)
        )
      ); // Need to OR it for Team B, wait drizzle doesn't support easy OR without importing `or`
    const teamMatchesB = await db
      .select()
      .from(matches)
      .where(
        and(
          eq(matches.teamBId, teamId)
        )
      );
    return teamMatches.length + teamMatchesB.length;
  }
}
