import { eq } from 'drizzle-orm';
import { db } from '../index';
import { matches } from '../schema/matches';
import { CreateMatchDto, UpdateMatchDto } from '../../types/match.types';

export class MatchRepository {
  async create(sessionId: number, data: CreateMatchDto) {
    const [newMatch] = await db
      .insert(matches)
      .values({
        sessionId,
        teamAId: data.teamAId,
        teamBId: data.teamBId,
        oversPerInnings: data.oversPerInnings,
        tossWinnerTeamId: data.tossWinnerTeamId,
        tossDecision: data.tossDecision,
        startedAt: new Date(),
      })
      .returning();
    return newMatch;
  }

  async findBySessionId(sessionId: number) {
    return await db.query.matches.findMany({
      where: eq(matches.sessionId, sessionId),
      with: {
        teamA: true,
        teamB: true,
        tossWinnerTeam: true,
        winnerTeam: true,
      }
    });
  }

  async findById(matchId: number) {
    const match = await db.query.matches.findFirst({
      where: eq(matches.matchId, matchId),
      with: {
        teamA: true,
        teamB: true,
        tossWinnerTeam: true,
        winnerTeam: true,
        session: true,
      }
    });
    return match;
  }

  async getLiveScoringData(matchId: number) {
    const match = await db.query.matches.findFirst({
      where: eq(matches.matchId, matchId),
      with: {
        session: true,
        teamA: {
          with: { players: true }
        },
        teamB: {
          with: { players: true }
        },
        innings: true
      }
    });
    return match;
  }

  async update(matchId: number, data: UpdateMatchDto, tx: any = db) {
    const [updatedMatch] = await tx
      .update(matches)
      .set({
        status: data.status,
        currentInning: data.currentInning,
        tossWinnerTeamId: data.tossWinnerTeamId,
        tossDecision: data.tossDecision,
        winnerTeamId: data.winnerTeamId,
        winType: data.winType,
        winMargin: data.winMargin,
        startedAt: data.startedAt ? new Date(data.startedAt) : undefined,
        completedAt: data.completedAt ? new Date(data.completedAt) : undefined,
      })
      .where(eq(matches.matchId, matchId))
      .returning();
    return updatedMatch;
  }

  async delete(matchId: number) {
    await db.delete(matches).where(eq(matches.matchId, matchId));
  }
}
