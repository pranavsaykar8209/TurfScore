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

    type PlayerType = { id: string; name: string; team: string };
    let striker: PlayerType | null = null;
    let nonStriker: PlayerType | null = null;
    let bowler: PlayerType | null = null;

    let batterStats: Record<string, any> = {};
    let bowlerStats: Record<string, any> = {};

    if (currentInnings) {
      striker = players.find(p => p.id === currentInnings.currentStrikerId?.toString()) || null;
      nonStriker = players.find(p => p.id === currentInnings.currentNonStrikerId?.toString()) || null;
      bowler = players.find(p => p.id === currentInnings.currentBowlerId?.toString()) || null;

      // Map player stats
      if (currentInnings.playerStats) {
        currentInnings.playerStats.forEach((stat: any) => {
          const pId = stat.playerId.toString();
          if (stat.ballsFaced > 0 || stat.runs > 0 || (striker?.id === pId) || (nonStriker?.id === pId)) {
            batterStats[pId] = {
              runs: stat.runs,
              balls: stat.ballsFaced,
              fours: stat.fours,
              sixes: stat.sixes
            };
          }
          if (stat.ballsBowled > 0 || stat.runsConceded > 0 || stat.wides > 0 || stat.noBalls > 0 || (bowler?.id === pId)) {
            bowlerStats[pId] = {
              runs: stat.runsConceded,
              balls: stat.ballsBowled,
              wickets: stat.wickets,
              wides: stat.wides,
              noBalls: stat.noBalls,
              maidens: stat.maidens
            };
          }
        });
      }
    }

    const mapBallsToDeliveries = (balls: any[]) => {
      return balls.sort((a: any, b: any) => a.ballNumber - b.ballNumber).map((b: any) => {
        let type = 'NORMAL';
        let runs = b.runsOffBat;
        
        if (b.extraType === 'wide') { type = 'WIDE'; runs = b.extraRuns - 1; }
        else if (b.extraType === 'no_ball') { type = 'NO_BALL'; runs = b.runsOffBat; } 
        else if (b.extraType === 'bye') { type = 'BYE'; runs = b.extraRuns; }
        else if (b.extraType === 'leg_bye') { type = 'LEG_BYE'; runs = b.extraRuns; }
        
        if (b.isWicket && !b.extraType) {
            type = 'WICKET';
        }

        return {
          id: b.ballId.toString(),
          runs,
          type,
          isBoundary: b.runsOffBat === 4 || b.runsOffBat === 6,
          isWicket: b.isWicket,
          bowlerId: b.bowlerId?.toString(),
          batterId: b.strikerId?.toString(),
          dismissedPlayerId: b.dismissedPlayerId?.toString(),
        };
      });
    };

    let currentOverDeliveries: any[] = [];
    if (currentInnings && currentInnings.balls) {
      const currentOverNumber = currentInnings.currentOverNumber || 0;
      const overBalls = currentInnings.balls.filter((b: any) => b.overNumber === currentOverNumber);
      currentOverDeliveries = mapBallsToDeliveries(overBalls);
    }

    const allInningsData = match.innings.map(inning => {
      const balls = inning.balls || [];
      const oversMap = new Map<number, any[]>();
      let fow: any[] = [];
      let dismissals: string[] = [];
      let totalRuns = 0;
      let totalWickets = 0;

      balls.sort((a: any, b: any) => {
        if (a.overNumber !== b.overNumber) return a.overNumber - b.overNumber;
        return a.ballNumber - b.ballNumber;
      }).forEach((b: any) => {
        // Group into overs
        if (!oversMap.has(b.overNumber)) {
          oversMap.set(b.overNumber, []);
        }
        oversMap.get(b.overNumber)?.push(b);

        // Track score for FOW
        totalRuns += b.runsOffBat + b.extraRuns;
        
        if (b.isWicket && b.dismissedPlayerId) {
          totalWickets++;
          const dismissedPlayer = players.find(p => p.id === b.dismissedPlayerId.toString());
          dismissals.push(b.dismissedPlayerId.toString());
          fow.push({
            score: totalRuns,
            wicketNumber: totalWickets,
            over: b.overNumber,
            ball: b.ballNumber,
            batterName: dismissedPlayer?.name || 'Unknown',
            batterId: b.dismissedPlayerId.toString()
          });
        }
      });

      const overs = Array.from(oversMap.entries()).map(([overNumber, overBalls]) => ({
        overNumber,
        deliveries: mapBallsToDeliveries(overBalls)
      }));

      return {
        inningNumber: inning.inningNumber,
        battingTeamId: inning.battingTeamId,
        bowlingTeamId: inning.bowlingTeamId,
        overs,
        fow,
        dismissals
      };
    });

    return {
      sessionData: {
        sessionName: match.session.sessionName,
        teamAId: match.teamAId,
        teamA: match.teamA.teamName,
        teamBId: match.teamBId,
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
      currentInningsData: currentInnings ? {
        ...currentInnings,
        batterStats,
        bowlerStats,
        currentOverDeliveries
      } : null,
      allInningsData,
      match: {
        currentInning: match.currentInning,
        status: match.status
      }
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
