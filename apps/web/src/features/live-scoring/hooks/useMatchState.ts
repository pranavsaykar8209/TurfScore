import { useState, useCallback } from 'react';
import { MatchState, Delivery, DeliveryType } from '../types';
import { PlayerSelection } from '../../match-setup/types';

export function useMatchState(initialState: Partial<MatchState>) {
  const [state, setState] = useState<MatchState>({
    totalRuns: 0,
    totalWickets: 0,
    currentOver: 0,
    currentBall: 0,
    striker: initialState.striker || null,
    nonStriker: initialState.nonStriker || null,
    currentBowler: initialState.currentBowler || null,
    overs: [],
    currentOverDeliveries: [],
    ...initialState,
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
      const isLegal = type !== 'WIDE' && type !== 'NO_BALL';
      const actualIsWicket = isWicket || type === 'WICKET';
      
      const newTotalRuns = prev.totalRuns + runs + (!isLegal ? 1 : 0); // Wides/NB usually give 1 penalty run
      const newTotalWickets = prev.totalWickets + (actualIsWicket ? 1 : 0);
      
      let newBall = isLegal ? prev.currentBall + 1 : prev.currentBall;
      
      const delivery: Delivery = {
        id: Date.now().toString(),
        runs,
        type,
        isBoundary,
        isWicket: actualIsWicket,
        wicketType,
        bowlerId: prev.currentBowler?.id || '',
        batterId: prev.striker?.id || '',
      };

      let newOverDeliveries = [...prev.currentOverDeliveries, delivery];
      let newOvers = prev.overs;
      let newCurrentOver = prev.currentOver;

      // Auto-change strike on odd runs if it's a legal ball
      let newStriker = prev.striker;
      let newNonStriker = prev.nonStriker;
      
      if (runs % 2 !== 0 && !actualIsWicket) {
        newStriker = prev.nonStriker;
        newNonStriker = prev.striker;
      }

      if (newBall >= 6) {
        newOvers = [...prev.overs, { overNumber: prev.currentOver + 1, deliveries: newOverDeliveries, isComplete: true }];
        newCurrentOver = prev.currentOver + 1;
        newBall = 0;
        newOverDeliveries = [];
        // Swap strike at end of over
        const temp = newStriker;
        newStriker = newNonStriker;
        newNonStriker = temp;
      }

      return {
        ...prev,
        totalRuns: newTotalRuns,
        totalWickets: newTotalWickets,
        currentBall: newBall,
        currentOver: newCurrentOver,
        overs: newOvers,
        currentOverDeliveries: newOverDeliveries,
        striker: newStriker,
        nonStriker: newNonStriker,
      };
    });
  }, [saveHistory]);

  const addWicket = useCallback(() => {
    addDelivery({ runs: 0, isWicket: true });
  }, [addDelivery]);

  const endOver = useCallback(() => {
    saveHistory();
    setState((prev) => {
      // Swap strike at end of over
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

  return {
    state,
    addDelivery,
    addWicket,
    endOver,
    changeStrike,
    undo,
    canUndo: history.length > 0,
  };
}
