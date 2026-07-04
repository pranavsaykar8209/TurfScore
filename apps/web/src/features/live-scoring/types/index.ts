import { PlayerSelection } from '../../match-setup/types';

export type DeliveryType = 'NORMAL' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'WICKET';

export interface Delivery {
  id: string;
  runs: number;
  type: DeliveryType;
  isBoundary?: boolean;
  bowlerId: string;
  batterId: string;
}

export interface Over {
  overNumber: number;
  deliveries: Delivery[];
  isComplete: boolean;
}

export interface MatchState {
  // Score
  totalRuns: number;
  totalWickets: number;
  currentOver: number;
  currentBall: number; // 1 to 6
  
  // Players
  striker: PlayerSelection | null;
  nonStriker: PlayerSelection | null;
  currentBowler: PlayerSelection | null;
  
  // Target (for 2nd innings)
  target?: number;
  
  // Overs tracking
  overs: Over[];
  currentOverDeliveries: Delivery[];
}
