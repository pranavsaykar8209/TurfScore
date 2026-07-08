import { eq, and } from 'drizzle-orm';
import { db } from '../index';
import { innings } from '../schema/innings';
import { CreateInningsDto, UpdateInningsDto } from '../../types/innings.types';

export class InningsRepository {
  async create(data: CreateInningsDto, tx: any = db) {
    const [newInning] = await tx
      .insert(innings)
      .values(data)
      .returning();
    return newInning;
  }

  async findByMatchIdAndNumber(matchId: number, inningNumber: number, tx: any = db) {
    return await tx.query.innings.findFirst({
      where: and(eq(innings.matchId, matchId), eq(innings.inningNumber, inningNumber)),
      with: {
        battingTeam: true,
        bowlingTeam: true,
      }
    });
  }

  async findById(inningId: number, tx: any = db) {
    return await tx.query.innings.findFirst({
      where: eq(innings.inningId, inningId),
      with: {
        battingTeam: true,
        bowlingTeam: true,
        match: true,
      }
    });
  }

  async update(inningId: number, data: UpdateInningsDto, tx: any = db) {
    const [updatedInning] = await tx
      .update(innings)
      .set(data)
      .where(eq(innings.inningId, inningId))
      .returning();
    return updatedInning;
  }
}
