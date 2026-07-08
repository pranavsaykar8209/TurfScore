import { db } from '../db/index';
import { InningsRepository } from '../db/repositories/innings.repository';
import { MatchRepository } from '../db/repositories/match.repository';
import { UpdateInningsDto } from '../types/innings.types';

export class InningsService {
  private inningsRepo: InningsRepository;
  private matchRepo: MatchRepository;

  constructor() {
    this.inningsRepo = new InningsRepository();
    this.matchRepo = new MatchRepository();
  }

  async startFirstInnings(matchId: number) {
    return await db.transaction(async (tx) => {
      const match = await this.matchRepo.findById(matchId);
      if (!match) throw new Error('Match not found');
      if (match.status !== 'scheduled' && match.status !== 'live') {
        throw new Error('Match must be scheduled or live to start first innings');
      }

      const existingInnings = await this.inningsRepo.findByMatchIdAndNumber(matchId, 1, tx);
      if (existingInnings) {
        throw new Error('First innings already started');
      }

      let battingTeamId = match.teamAId;
      let bowlingTeamId = match.teamBId;
      
      if (match.tossWinnerTeamId && match.tossDecision) {
        if (match.tossDecision === 'bat') {
          battingTeamId = match.tossWinnerTeamId;
          bowlingTeamId = match.teamAId === match.tossWinnerTeamId ? match.teamBId : match.teamAId;
        } else {
          bowlingTeamId = match.tossWinnerTeamId;
          battingTeamId = match.teamAId === match.tossWinnerTeamId ? match.teamBId : match.teamAId;
        }
      }

      if (match.status !== 'live') {
        await this.matchRepo.update(matchId, { status: 'live', currentInning: 1 }, tx);
      } else {
        await this.matchRepo.update(matchId, { currentInning: 1 }, tx);
      }

      return await this.inningsRepo.create({
        matchId,
        inningNumber: 1,
        battingTeamId,
        bowlingTeamId,
        currentStrikerId: null,
        currentNonStrikerId: null,
        currentBowlerId: null,
        currentOverNumber: 0,
      }, tx);
    });
  }

  async getCurrentInnings(matchId: number) {
    const match = await this.matchRepo.findById(matchId);
    if (!match) throw new Error('Match not found');
    if (!match.currentInning) throw new Error('No active innings');

    const innings = await this.inningsRepo.findByMatchIdAndNumber(matchId, match.currentInning);
    if (!innings) throw new Error('Innings not found');
    return innings;
  }

  async getInnings(inningId: number) {
    const innings = await this.inningsRepo.findById(inningId);
    if (!innings) throw new Error('Innings not found');
    return innings;
  }

  async updateInnings(inningId: number, data: UpdateInningsDto) {
    return await db.transaction(async (tx) => {
      const innings = await this.inningsRepo.findById(inningId, tx);
      if (!innings) throw new Error('Innings not found');

      return await this.inningsRepo.update(inningId, data, tx);
    });
  }

  async endInnings(inningId: number) {
    return await db.transaction(async (tx) => {
      const innings = await this.inningsRepo.findById(inningId, tx);
      if (!innings) throw new Error('Innings not found');

      const match = await this.matchRepo.findById(innings.matchId);
      if (!match) throw new Error('Match not found');

      if (innings.inningNumber === 2) {
        await this.matchRepo.update(match.matchId, { status: 'completed', completedAt: new Date() }, tx);
      }
      
      return innings;
    });
  }

  async startSecondInnings(matchId: number) {
    return await db.transaction(async (tx) => {
      const match = await this.matchRepo.findById(matchId);
      if (!match) throw new Error('Match not found');

      const firstInnings = await this.inningsRepo.findByMatchIdAndNumber(matchId, 1, tx);
      if (!firstInnings) throw new Error('First innings not found');

      const existingSecondInnings = await this.inningsRepo.findByMatchIdAndNumber(matchId, 2, tx);
      if (existingSecondInnings) throw new Error('Second innings already started');

      const battingTeamId = firstInnings.bowlingTeamId;
      const bowlingTeamId = firstInnings.battingTeamId;

      await this.matchRepo.update(matchId, { currentInning: 2 }, tx);

      return await this.inningsRepo.create({
        matchId,
        inningNumber: 2,
        battingTeamId,
        bowlingTeamId,
        currentStrikerId: null,
        currentNonStrikerId: null,
        currentBowlerId: null,
        currentOverNumber: 0,
      }, tx);
    });
  }
}
