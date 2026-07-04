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

  const addDelivery = useCallback((
    runs: number, 
    type: DeliveryType = 'NORMAL', 
    isBoundary: boolean = false
  ) => {
    saveHistory();

    setState((prev) => {
      const isLegal = type !== 'WIDE' && type !== 'NO_BALL';
      const isWicket = type === 'WICKET';
      
      const newTotalRuns = prev.totalRuns + runs + (!isLegal ? 1 : 0); // Wides/NB usually give 1 penalty run
      const newTotalWickets = prev.totalWickets + (isWicket ? 1 : 0);
      
      const newBall = isLegal ? prev.currentBall + 1 : prev.currentBall;
      
      const delivery: Delivery = {
        id: Date.now().toString(),
        runs,
        type,
        isBoundary,
        bowlerId: prev.currentBowler?.id || '',
        batterId: prev.striker?.id || '',
      };

      const deliveries = [...prev.currentOverDeliveries, delivery];

      // Auto-change strike on odd runs if it's a legal ball
      let newStriker = prev.striker;
      let newNonStriker = prev.nonStriker;
      
      if (runs % 2 !== 0 && type !== 'WICKET') {
        newStriker = prev.nonStriker;
        newNonStriker = prev.striker;
      }

      return {
        ...prev,
        totalRuns: newTotalRuns,
        totalWickets: newTotalWickets,
        currentBall: newBall,
        currentOverDeliveries: deliveries,
        striker: newStriker,
        nonStriker: newNonStriker,
      };
    });
  }, [saveHistory]);

  const addWicket = useCallback(() => {
    addDelivery(0, 'WICKET');
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
