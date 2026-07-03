export type TossWinner = 'A' | 'B' | null;
export type TossDecision = 'BAT' | 'BOWL' | null;

export interface PlayerSelection {
  id: string;
  name: string;
}

export interface MatchSetupData {
  striker: PlayerSelection | null;
  nonStriker: PlayerSelection | null;
  bowler: PlayerSelection | null;
}
