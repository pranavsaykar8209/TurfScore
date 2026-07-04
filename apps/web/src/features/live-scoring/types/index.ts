import { PlayerSelection } from '../../match-setup/types';

export type DeliveryType = 'NORMAL' | 'WIDE' | 'NO_BALL' | 'BYE' | 'LEG_BYE' | 'WICKET';

export interface Delivery {
  id: string;
  runs: number;
  type: DeliveryType;
  isBoundary?: boolean;
  isWicket?: boolean;
  wicketType?: string;
  bowlerId: string;
  batterId: string;
}

export interface Over {
  overNumber: number;
  deliveries: Delivery[];
  isComplete: boolean;
}

export interface BatterStats {
  runs: number;
  balls: number;
}

export interface BowlerStats {
  runs: number;
  balls: number;
  wickets: number;
}

export interface MatchState {
  // Score
  totalRuns: number;
  extraRuns: number;
  totalWickets: number;
  currentOver: number;
  currentBall: number; // 1 to 6
  
  // Players
  striker: PlayerSelection | null;
  nonStriker: PlayerSelection | null;
  currentBowler: PlayerSelection | null;
  
  // Stats
  batterStats: Record<string, BatterStats>;
  bowlerStats: Record<string, BowlerStats>;
  
  // Target (for 2nd innings)
  target?: number;
  
  // Overs tracking
  overs: Over[];
  currentOverDeliveries: Delivery[];
  
  // Rules state
  isFreeHit?: boolean;
  needsNewBatsman?: boolean;
  needsNewBowler?: boolean;
  pendingWicketType?: string;
  outPlayers: string[];
}
