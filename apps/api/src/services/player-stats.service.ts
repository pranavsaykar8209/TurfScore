import { PlayerStatsRepository } from '../db/repositories/player-stats.repository';
import { SessionRepository } from '../db/repositories/session.repository';
import { MatchRepository } from '../db/repositories/match.repository';

export class PlayerStatsService {
  private playerStatsRepo: PlayerStatsRepository;
  private sessionRepo: SessionRepository;
  private matchRepo: MatchRepository;

  constructor() {
    this.playerStatsRepo = new PlayerStatsRepository();
    this.sessionRepo = new SessionRepository();
    this.matchRepo = new MatchRepository();
  }

  async getMatchScorecard(matchId: number) {
    const match = await this.matchRepo.findById(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    const stats = await this.playerStatsRepo.getByMatchId(matchId);
    return stats;
  }

  async getSessionStats(sessionCode: string) {
    const session = await this.sessionRepo.findByCode(sessionCode);
    if (!session) {
      throw new Error('Session not found');
    }

    const stats = await this.playerStatsRepo.getBySessionId(session.sessionId);
    return stats;
  }

  async getLeaderboards(sessionCode: string) {
    const stats = await this.getSessionStats(sessionCode);

    const mostRuns = [...stats].sort((a, b) => b.runs - a.runs).slice(0, 10);
    const mostWickets = [...stats].sort((a, b) => b.wickets - a.wickets).slice(0, 10);
    const mostSixes = [...stats].sort((a, b) => b.sixes - a.sixes).slice(0, 10);

    return {
      mostRuns,
      mostWickets,
      mostSixes
    };
  }
}
