import { MatchRepository } from '../db/repositories/match.repository';
import { SessionRepository } from '../db/repositories/session.repository';
import { TeamRepository } from '../db/repositories/team.repository';
import { CreateMatchDto, UpdateMatchDto } from '../types/match.types';

export class MatchService {
  private matchRepository: MatchRepository;
  private sessionRepository: SessionRepository;
  private teamRepository: TeamRepository;

  constructor() {
    this.matchRepository = new MatchRepository();
    this.sessionRepository = new SessionRepository();
    this.teamRepository = new TeamRepository();
  }

  async createMatch(sessionCode: string, data: CreateMatchDto) {
    const session = await this.sessionRepository.findByCode(sessionCode);
    if (!session) {
      throw new Error('Session not found');
    }

    if (data.teamAId === data.teamBId) {
      throw new Error('Team A and Team B must be different');
    }

    const teamA = await this.teamRepository.findById(data.teamAId);
    const teamB = await this.teamRepository.findById(data.teamBId);

    if (!teamA || teamA.sessionId !== session.sessionId) {
      throw new Error('Team A not found in this session');
    }
    if (!teamB || teamB.sessionId !== session.sessionId) {
      throw new Error('Team B not found in this session');
    }

    if (data.tossWinnerTeamId) {
      if (data.tossWinnerTeamId !== data.teamAId && data.tossWinnerTeamId !== data.teamBId) {
        throw new Error('Toss winner must be one of the participating teams');
      }
    }

    const match = await this.matchRepository.create(session.sessionId, data);
    return match;
  }

  async getMatches(sessionCode: string) {
    const session = await this.sessionRepository.findByCode(sessionCode);
    if (!session) {
      throw new Error('Session not found');
    }

    const matches = await this.matchRepository.findBySessionId(session.sessionId);
    return matches;
  }

  async getMatch(matchId: number) {
    const match = await this.matchRepository.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }
    return match;
  }

  async getLiveScoringData(matchId: number) {
    const match = await this.matchRepository.getLiveScoringData(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    const players = [
      ...match.teamA.players.map(p => ({
        id: p.playerId.toString(),
        name: p.playerName,
        team: 'A'
      })),
      ...match.teamB.players.map(p => ({
        id: p.playerId.toString(),
        name: p.playerName,
        team: 'B'
      }))
    ];

    const currentInnings = match.innings.find(i => i.inningNumber === match.currentInning) || null;

    let striker = null;
    let nonStriker = null;
    let bowler = null;

    if (currentInnings) {
      striker = players.find(p => p.id === currentInnings.currentStrikerId?.toString()) || null;
      nonStriker = players.find(p => p.id === currentInnings.currentNonStrikerId?.toString()) || null;
      bowler = players.find(p => p.id === currentInnings.currentBowlerId?.toString()) || null;
    }

    return {
      sessionData: {
        sessionName: match.session.sessionName,
        teamA: match.teamA.teamName,
        teamB: match.teamB.teamName,
        players
      },
      tossData: {
        winner: match.tossWinnerTeamId === match.teamAId ? 'A' : 'B',
        decision: match.tossDecision?.toUpperCase() || 'BAT'
      },
      matchSetup: {
        overs: match.oversPerInnings,
        striker,
        nonStriker,
        bowler,
      },
      currentInningsData: currentInnings
    };
  }

  async updateMatch(matchId: number, data: UpdateMatchDto) {
    const match = await this.matchRepository.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    // Status transition checks (e.g. cannot update completed match unless admin, etc.)
    // For now, simple update
    if (data.tossWinnerTeamId) {
      if (data.tossWinnerTeamId !== match.teamAId && data.tossWinnerTeamId !== match.teamBId) {
        throw new Error('Toss winner must be one of the participating teams');
      }
    }

    if (data.winnerTeamId) {
      if (data.winnerTeamId !== match.teamAId && data.winnerTeamId !== match.teamBId) {
        throw new Error('Winner must be one of the participating teams');
      }
    }

    const updatedMatch = await this.matchRepository.update(matchId, data);
    return updatedMatch;
  }

  async deleteMatch(matchId: number) {
    const match = await this.matchRepository.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    if (match.status !== 'scheduled') {
      throw new Error('Cannot delete a match that has already started');
    }

    await this.matchRepository.delete(matchId);
    return true;
  }
}
