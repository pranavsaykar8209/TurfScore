import { useState, useCallback } from 'react';
import { MatchState, Delivery, DeliveryType } from '../types';

export function useMatchState(initialState: Partial<MatchState>, matchConfig: { totalOvers: number; teamSize: number }) {
  const [state, setState] = useState<MatchState>({
    totalRuns: 0,
    extraRuns: 0,
    totalWickets: 0,
    currentOver: 0,
    currentBall: 0,
    striker: initialState.striker || null,
    nonStriker: initialState.nonStriker || null,
    currentBowler: initialState.currentBowler || null,
    overs: [],
    currentOverDeliveries: [],
    batterStats: {},
    bowlerStats: {},
    innings: initialState.innings || 1,
    isInningsComplete: initialState.isInningsComplete || false,
    isMatchComplete: initialState.isMatchComplete || false,
    ...initialState,
    needsNewBatsman: false,
    needsNewBowler: false,
    pendingWicketType: undefined,
    outPlayers: initialState.outPlayers || [],
  });

  const [history, setHistory] = useState<MatchState[]>([]);

  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev, structuredClone(state)]);
  }, [state]);

  const addDelivery = useCallback((params: {
    runs: number;
    type?: DeliveryType;
    isBoundary?: boolean;
    isWicket?: boolean;
    wicketType?: string;
  }) => {
    saveHistory();

    setState((prev) => {
      const { runs, type = 'NORMAL', isBoundary = false, isWicket = false, wicketType } = params;
      const actualIsWicket = isWicket || type === 'WICKET';
      
      let {
        totalRuns,
        extraRuns,
        totalWickets,
        currentBall,
        currentOver,
        overs,
        currentOverDeliveries,
        striker,
        nonStriker,
        batterStats,
        bowlerStats,
        isFreeHit,
        needsNewBatsman,
        needsNewBowler,
        pendingWicketType,
      } = prev;

      const strikerId = striker?.id || '';
      const bowlerId = prev.currentBowler?.id || '';
      
      const newBatterStats = { ...batterStats };
      const newBowlerStats = { ...bowlerStats };

      if (strikerId && !newBatterStats[strikerId]) {
        newBatterStats[strikerId] = { runs: 0, balls: 0 };
      }
      if (bowlerId && !newBowlerStats[bowlerId]) {
        newBowlerStats[bowlerId] = { runs: 0, balls: 0, wickets: 0 };
      }

      const currentBatterStat = strikerId ? { ...newBatterStats[strikerId] } : { runs: 0, balls: 0 };
      const currentBowlerStat = bowlerId ? { ...newBowlerStats[bowlerId] } : { runs: 0, balls: 0, wickets: 0 };

      let runsToAddTeam = 0;
      let runsToAddExtra = 0;
      let runsToAddBatter = 0;
      let ballsToAddBatter = 0;
      let runsToAddBowler = 0;
      let ballsToAddBowler = 0;
      let ballsToAddOver = 0;
      let wicketsToAdd = 0;
      let changeStrike = false;
      let newNeedsNewBatsman = needsNewBatsman;
      let newNeedsNewBowler = needsNewBowler;
      let newPendingWicketType = pendingWicketType;

      if (actualIsWicket) {
        wicketsToAdd = 1;
        ballsToAddBatter = 1;
        ballsToAddBowler = 1;
        ballsToAddOver = 1;
        runsToAddTeam = runs;
        runsToAddBatter = runs;
        runsToAddBowler = runs;
        if (runs % 2 !== 0) changeStrike = true; // In case batters crossed on a run-out
        newNeedsNewBatsman = true;
        newPendingWicketType = wicketType || 'BOWLED';
      } else if (type === 'WIDE') {
        runsToAddTeam = 1 + runs;
        runsToAddExtra = 1 + runs;
        runsToAddBatter = 0;
        ballsToAddBatter = 0;
        runsToAddBowler = 1 + runs;
        ballsToAddBowler = 0;
        ballsToAddOver = 0;
      } else if (type === 'NO_BALL') {
        runsToAddTeam = 1 + runs;
        runsToAddExtra = 1;
        runsToAddBatter = runs;
        ballsToAddBatter = 1;
        runsToAddBowler = 1 + runs;
        ballsToAddBowler = 0;
        ballsToAddOver = 0;
      } else if (type === 'BYE' || type === 'LEG_BYE') {
        runsToAddTeam = runs;
        runsToAddExtra = runs;
        runsToAddBatter = 0;
        ballsToAddBatter = 1;
        runsToAddBowler = 0;
        ballsToAddBowler = 1;
        ballsToAddOver = 1;
        if (runs % 2 !== 0) changeStrike = true;
      } else {
        runsToAddTeam = runs;
        runsToAddBatter = runs;
        ballsToAddBatter = 1;
        runsToAddBowler = runs;
        ballsToAddBowler = 1;
        ballsToAddOver = 1;
        if (runs % 2 !== 0) changeStrike = true;
      }

      currentBatterStat.runs += runsToAddBatter;
      currentBatterStat.balls += ballsToAddBatter;
      currentBowlerStat.runs += runsToAddBowler;
      currentBowlerStat.balls += ballsToAddBowler;
      if (actualIsWicket) currentBowlerStat.wickets += wicketsToAdd;

      if (strikerId) newBatterStats[strikerId] = currentBatterStat;
      if (bowlerId) newBowlerStats[bowlerId] = currentBowlerStat;

      totalRuns += runsToAddTeam;
      extraRuns = (extraRuns || 0) + runsToAddExtra;
      totalWickets += wicketsToAdd;
      currentBall += ballsToAddOver;

      const delivery: Delivery = {
        id: Date.now().toString(),
        runs,
        type,
        isBoundary,
        isWicket: actualIsWicket,
        wicketType,
        bowlerId,
        batterId: strikerId,
      };

      currentOverDeliveries = [...currentOverDeliveries, delivery];

      if (changeStrike) {
        const temp = striker;
        striker = nonStriker;
        nonStriker = temp;
      }

      if (currentBall >= 6) {
        overs = [...overs, { overNumber: currentOver + 1, deliveries: currentOverDeliveries, isComplete: true }];
        currentOver = currentOver + 1;
        currentBall = 0;
        currentOverDeliveries = [];
        
        // Swap strike at end of over
        const temp = striker;
        striker = nonStriker;
        nonStriker = temp;
        
        newNeedsNewBowler = true;
      }

      let nextIsFreeHit = isFreeHit;
      if (type === 'NO_BALL') {
        nextIsFreeHit = true;
      } else if (type !== 'WIDE') {
        nextIsFreeHit = false;
      }

      const newState: MatchState = {
        ...prev,
        totalRuns,
        extraRuns,
        totalWickets,
        currentBall,
        currentOver,
        overs,
        currentOverDeliveries,
        striker,
        nonStriker,
        batterStats: newBatterStats,
        bowlerStats: newBowlerStats,
        isFreeHit: nextIsFreeHit,
        needsNewBatsman: newNeedsNewBatsman,
        needsNewBowler: newNeedsNewBowler,
        pendingWicketType: newPendingWicketType,
      };

      // Evaluate match rules
      if (newState.innings === 1) {
        const isAllOut = newState.totalWickets >= matchConfig.teamSize - 1;
        const isOversComplete = newState.currentOver >= matchConfig.totalOvers;

        if (isAllOut || isOversComplete) {
          newState.isInningsComplete = true;
          newState.target = newState.totalRuns + 1;
          newState.needsNewBatsman = false;
          newState.needsNewBowler = false;
        }
      } else if (newState.innings === 2) {
        const isTargetReached = newState.target ? newState.totalRuns >= newState.target : false;
        const isAllOut = newState.totalWickets >= matchConfig.teamSize - 1;
        const isOversComplete = newState.currentOver >= matchConfig.totalOvers;

        if (isTargetReached) {
          newState.isMatchComplete = true;
          newState.isInningsComplete = true;
          newState.matchWinner = 'BATTING_TEAM';
          newState.winMargin = `${matchConfig.teamSize - 1 - newState.totalWickets} wickets`;
          newState.needsNewBatsman = false;
          newState.needsNewBowler = false;
        } else if (isAllOut || isOversComplete) {
          newState.isMatchComplete = true;
          newState.isInningsComplete = true;
          
          if (newState.target && newState.totalRuns < newState.target - 1) {
             newState.matchWinner = 'BOWLING_TEAM';
             newState.winMargin = `${newState.target - 1 - newState.totalRuns} runs`;
          } else {
             newState.matchWinner = 'TIE';
          }
          newState.needsNewBatsman = false;
          newState.needsNewBowler = false;
        }
      }

      return newState;
    });
  }, [saveHistory]);

  const setNewBatsman = useCallback((player: import('../../match-setup/types').PlayerSelection, outPlayerId?: string) => {
    setState((prev) => {
      let { striker, nonStriker } = prev;
      if (striker?.id === outPlayerId) {
        striker = player;
      } else if (nonStriker?.id === outPlayerId) {
        nonStriker = player;
      } else {
        // Fallback: if no outPlayerId specified, just replace whoever is null, or default to striker
        if (!striker) striker = player;
        else if (!nonStriker) nonStriker = player;
        else striker = player; 
      }
      return {
        ...prev,
        striker,
        nonStriker,
        needsNewBatsman: false,
        pendingWicketType: undefined,
        outPlayers: outPlayerId ? [...prev.outPlayers, outPlayerId] : prev.outPlayers,
      };
    });
  }, [saveHistory]);

  const setNewBowler = useCallback((player: import('../../match-setup/types').PlayerSelection) => {
    setState((prev) => ({
      ...prev,
      currentBowler: player,
      needsNewBowler: false,
    }));
  }, []);

  const addWicket = useCallback(() => {
    addDelivery({ runs: 0, isWicket: true });
  }, [addDelivery]);

  const endOver = useCallback(() => {
    saveHistory();
    setState((prev) => {
      return {
        ...prev,
        overs: [...prev.overs, { overNumber: prev.currentOver + 1, deliveries: prev.currentOverDeliveries, isComplete: true }],
        currentOver: prev.currentOver + 1,
        currentBall: 0,
        currentOverDeliveries: [],
        striker: prev.nonStriker,
        nonStriker: prev.striker,
      };
    });
  }, [saveHistory]);

  const changeStrike = useCallback(() => {
    saveHistory();
    setState((prev) => ({
      ...prev,
      striker: prev.nonStriker,
      nonStriker: prev.striker,
    }));
  }, [saveHistory]);

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const newHistory = [...prev];
      const previousState = newHistory.pop()!;
      setState(previousState);
      return newHistory;
    });
  }, []);

  const startSecondInnings = useCallback((setup: { striker: import('../../match-setup/types').PlayerSelection | null; nonStriker: import('../../match-setup/types').PlayerSelection | null; bowler: import('../../match-setup/types').PlayerSelection | null; }) => {
    saveHistory();
    setState((prev) => ({
      ...prev,
      innings: 2,
      isInningsComplete: false,
      isMatchComplete: false,
      firstInningsScore: {
        runs: prev.totalRuns,
        wickets: prev.totalWickets,
        overs: prev.currentOver,
        overDeliveries: prev.currentBall,
      },
      totalRuns: 0,
      extraRuns: 0,
      totalWickets: 0,
      currentOver: 0,
      currentBall: 0,
      overs: [],
      currentOverDeliveries: [],
      batterStats: {},
      bowlerStats: {},
      outPlayers: [],
      striker: setup.striker,
      nonStriker: setup.nonStriker,
      currentBowler: setup.bowler,
      isFreeHit: false,
      needsNewBatsman: false,
      needsNewBowler: false,
      pendingWicketType: undefined,
    }));
  }, [saveHistory]);

  return {
    state,
    addDelivery,
    addWicket,
    endOver,
    changeStrike,
    undo,
    setNewBatsman,
    setNewBowler,
    startSecondInnings,
    canUndo: history.length > 0,
  };
}
