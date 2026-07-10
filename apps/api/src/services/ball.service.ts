import { db } from '../db';
import { RecordBallDto } from '../types/ball.types';
import { MatchRepository } from '../db/repositories/match.repository';
import { InningsRepository } from '../db/repositories/innings.repository';
import { PlayerStatsRepository } from '../db/repositories/player-stats.repository';
import { BallRepository } from '../db/repositories/ball.repository';
import { PlayerRepository } from '../db/repositories/player.repository';

export class BallService {
  private matchRepository: MatchRepository;
  private inningsRepository: InningsRepository;
  private playerStatsRepository: PlayerStatsRepository;
  private ballRepository: BallRepository;
  private playerRepository: PlayerRepository;

  constructor() {
    this.matchRepository = new MatchRepository();
    this.inningsRepository = new InningsRepository();
    this.playerStatsRepository = new PlayerStatsRepository();
    this.ballRepository = new BallRepository();
    this.playerRepository = new PlayerRepository();
  }

  async recordBall(matchId: number, data: RecordBallDto) {
    return await db.transaction(async (tx) => {
      const match = await this.matchRepository.findById(matchId);
      if (!match) throw new Error('Match not found');
      if (match.status !== 'live') throw new Error('Match is not live');

      const currentInning = await this.inningsRepository.findByMatchIdAndNumber(matchId, match.currentInning || 1, tx);
      if (!currentInning) throw new Error('Current innings not found');

      if (data.bowlerId === data.strikerId || data.bowlerId === data.nonStrikerId) {
        throw new Error('Bowler cannot be one of the batters');
      }

      // Check player validity could be done here, but assuming valid for now based on payload

      let isLegalBall = data.isLegalBall;
      let runsOffBat = data.runsOffBat;
      let extraType = data.extraType;
      let extraRuns = data.extraRuns;
      let isWicket = data.isWicket;

      // Ensure no_ball and wide are illegal
      if (extraType === 'wide' || extraType === 'no_ball') {
        isLegalBall = false;
      }

      // 1. Insert Ball
      const lastBall = await this.ballRepository.getLastBall(currentInning.inningId, tx);
      let currentOver = currentInning.currentOverNumber;
      
      // ballNumber will now represent the sequential delivery index within the over
      let ballNumber = 0;
      if (lastBall && lastBall.overNumber === currentOver) {
        ballNumber = lastBall.ballNumber;
      }
      ballNumber += 1;

      const ballData = {
        inningId: currentInning.inningId,
        overNumber: currentOver,
        ballNumber,
        strikerId: data.strikerId,
        nonStrikerId: data.nonStrikerId,
        bowlerId: data.bowlerId,
        runsOffBat,
        extraType,
        extraRuns,
        isLegalBall,
        isWicket,
        dismissedPlayerId: data.dismissedPlayerId || null,
      };

      await this.ballRepository.insert(ballData, tx);

      // 2. Update Stats
      let batterRuns = 0, batterBalls = 0, fours = 0, sixes = 0;
      let bowlerRuns = 0, bowlerBalls = 0, wides = 0, noBalls = 0, wickets = 0;
      let inningsRuns = 0, inningsExtras = 0;

      if (extraType === 'wide') {
        inningsExtras += extraRuns;
        inningsRuns += extraRuns;
        bowlerRuns += extraRuns;
        wides += extraRuns;
      } else if (extraType === 'no_ball') {
        inningsExtras += 1;
        inningsRuns += 1 + runsOffBat;
        bowlerRuns += 1 + runsOffBat;
        batterRuns += runsOffBat;
        batterBalls += 1;
        noBalls += 1;
        if (runsOffBat === 4) fours += 1;
        if (runsOffBat === 6) sixes += 1;
      } else if (extraType === 'bye' || extraType === 'leg_bye') {
        inningsExtras += extraRuns;
        inningsRuns += extraRuns;
        batterBalls += 1;
        bowlerBalls += 1;
      } else {
        batterRuns += runsOffBat;
        batterBalls += 1;
        bowlerRuns += runsOffBat;
        bowlerBalls += 1;
        inningsRuns += runsOffBat;
        if (runsOffBat === 4) fours += 1;
        if (runsOffBat === 6) sixes += 1;
      }

      if (isWicket && !data.dismissedPlayerId) {
          // If no dismissed player is specified, assume striker
          data.dismissedPlayerId = data.strikerId;
      }

      // If wicket is not run out / retired out, bowler gets wicket
      if (isWicket) {
        // Simple logic for wicket stats
        wickets += 1;
      }

      // Upsert batter stats
      await this.playerStatsRepository.upsert({
        playerId: data.strikerId,
        matchId: match.matchId,
        inningId: currentInning.inningId,
        teamId: currentInning.battingTeamId,
        runs: batterRuns,
        ballsFaced: batterBalls,
        fours,
        sixes,
      }, tx);

      // Upsert bowler stats
      await this.playerStatsRepository.upsert({
        playerId: data.bowlerId,
        matchId: match.matchId,
        inningId: currentInning.inningId,
        teamId: currentInning.bowlingTeamId,
        runsConceded: bowlerRuns,
        ballsBowled: bowlerBalls,
        wickets,
        wides,
        noBalls,
      }, tx);

      // 3. Update Innings
      const totalRuns = currentInning.totalRuns + inningsRuns;
      const totalWickets = currentInning.totalWickets + (isWicket ? 1 : 0);
      const totalExtras = currentInning.totalExtras + inningsExtras;
      const legalBalls = currentInning.legalBalls + (isLegalBall ? 1 : 0);
      
      let nextStrikerId = data.strikerId;
      let nextNonStrikerId = data.nonStrikerId;

      // Strike Rotation
      let changeStrike = false;
      if (extraType === 'wide') {
         const physicallyRun = extraRuns > 0 ? extraRuns - 1 : 0;
         if (physicallyRun % 2 !== 0) changeStrike = true;
      } else if (extraType === 'no_ball') {
         if (runsOffBat % 2 !== 0) changeStrike = true;
      } else if (extraType === 'bye' || extraType === 'leg_bye') {
         if (extraRuns % 2 !== 0) changeStrike = true;
      } else {
         if (runsOffBat % 2 !== 0) changeStrike = true;
      }

      if (changeStrike) {
        nextStrikerId = data.nonStrikerId;
        nextNonStrikerId = data.strikerId;
      }

      let isOverComplete = false;
      const legalBallsInOver = (currentInning.legalBalls % 6) + (isLegalBall ? 1 : 0);
      if (legalBallsInOver === 6) {
        isOverComplete = true;
        // Swap strike at end of over
        const temp = nextStrikerId;
        nextStrikerId = nextNonStrikerId;
        nextNonStrikerId = temp;
      }

      await this.inningsRepository.update(currentInning.inningId, {
        totalRuns,
        totalWickets,
        totalExtras,
        legalBalls,
        currentOverNumber: isOverComplete ? currentOver + 1 : currentOver,
        currentStrikerId: isWicket && data.dismissedPlayerId === nextStrikerId ? null : nextStrikerId,
        currentNonStrikerId: isWicket && data.dismissedPlayerId === nextNonStrikerId ? null : nextNonStrikerId,
        currentBowlerId: isOverComplete ? null : data.bowlerId,
      }, tx);

      // 4. Update Match Status if Innings Complete
      const isAllOut = totalWickets >= 10; // TurfScore might have dynamic sizes, but skipping that complexity for now or assuming 10
      // Actually turfscore might use matchConfig.teamSize. But we don't have that in db cleanly except maybe oversPerInnings
      const oversExhausted = isOverComplete && (currentOver + 1 >= match.oversPerInnings);

      if (isAllOut || oversExhausted) {
        if (currentInning.inningNumber === 1) {
          await this.matchRepository.update(matchId, { currentInning: 2 }, tx);
        } else {
          await this.matchRepository.update(matchId, { status: 'completed' }, tx);
        }
      }

      return { success: true, message: 'Ball recorded successfully' };
    });
  }

  async undoLastBall(matchId: number) {
    return await db.transaction(async (tx) => {
      const match = await this.matchRepository.findById(matchId);
      if (!match) throw new Error('Match not found');

      const currentInning = await this.inningsRepository.findByMatchIdAndNumber(matchId, match.currentInning || 1, tx);
      if (!currentInning) throw new Error('Current innings not found');

      const lastBall = await this.ballRepository.getLastBall(currentInning.inningId, tx);
      if (!lastBall) throw new Error('No balls to undo');

      // 1. Revert stats
      let batterRuns = 0, batterBalls = 0, fours = 0, sixes = 0;
      let bowlerRuns = 0, bowlerBalls = 0, wides = 0, noBalls = 0, wickets = 0;
      let inningsRuns = 0, inningsExtras = 0;
      let isLegalBall = lastBall.isLegalBall;

      if (lastBall.extraType === 'wide') {
        inningsExtras += lastBall.extraRuns;
        inningsRuns += lastBall.extraRuns;
        bowlerRuns += lastBall.extraRuns;
        wides += lastBall.extraRuns;
      } else if (lastBall.extraType === 'no_ball') {
        inningsExtras += 1;
        inningsRuns += 1 + lastBall.runsOffBat;
        bowlerRuns += 1 + lastBall.runsOffBat;
        batterRuns += lastBall.runsOffBat;
        batterBalls += 1;
        noBalls += 1;
        if (lastBall.runsOffBat === 4) fours += 1;
        if (lastBall.runsOffBat === 6) sixes += 1;
      } else if (lastBall.extraType === 'bye' || lastBall.extraType === 'leg_bye') {
        inningsExtras += lastBall.extraRuns;
        inningsRuns += lastBall.extraRuns;
        batterBalls += 1;
        bowlerBalls += 1;
      } else {
        batterRuns += lastBall.runsOffBat;
        batterBalls += 1;
        bowlerRuns += lastBall.runsOffBat;
        bowlerBalls += 1;
        inningsRuns += lastBall.runsOffBat;
        if (lastBall.runsOffBat === 4) fours += 1;
        if (lastBall.runsOffBat === 6) sixes += 1;
      }

      if (lastBall.isWicket) {
        wickets += 1;
      }

      // Upsert stats with negative values
      await this.playerStatsRepository.upsert({
        playerId: lastBall.strikerId,
        matchId: match.matchId,
        inningId: currentInning.inningId,
        teamId: currentInning.battingTeamId,
        runs: -batterRuns,
        ballsFaced: -batterBalls,
        fours: -fours,
        sixes: -sixes,
      }, tx);

      await this.playerStatsRepository.upsert({
        playerId: lastBall.bowlerId,
        matchId: match.matchId,
        inningId: currentInning.inningId,
        teamId: currentInning.bowlingTeamId,
        runsConceded: -bowlerRuns,
        ballsBowled: -bowlerBalls,
        wickets: -wickets,
        wides: -wides,
        noBalls: -noBalls,
      }, tx);

      // 2. Revert Innings
      const totalRuns = currentInning.totalRuns - inningsRuns;
      const totalWickets = currentInning.totalWickets - (lastBall.isWicket ? 1 : 0);
      const totalExtras = currentInning.totalExtras - inningsExtras;
      const legalBalls = currentInning.legalBalls - (isLegalBall ? 1 : 0);

      // We cannot easily determine previous striker without looking at the ball before lastBall
      // For a robust undo, we'd fetch `previousBall` to restore exact state.
      // We will leave currentStrikerId alone for now or fetch previous ball
      const prevBall = await this.ballRepository.getPreviousBall(currentInning.inningId, 1, tx);

      await this.inningsRepository.update(currentInning.inningId, {
        totalRuns,
        totalWickets,
        totalExtras,
        legalBalls,
        currentOverNumber: lastBall.overNumber,
        // Approximate restore of players
        currentStrikerId: prevBall ? prevBall.strikerId : lastBall.strikerId,
        currentNonStrikerId: prevBall ? prevBall.nonStrikerId : lastBall.nonStrikerId,
        currentBowlerId: lastBall.bowlerId,
      }, tx);

      // 3. Delete Ball
      await this.ballRepository.delete(lastBall.ballId, tx);

      return { success: true, message: 'Ball undone successfully' };
    });
  }
}
