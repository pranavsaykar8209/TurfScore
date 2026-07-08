export interface StepperProps {
  currentStep: number;
  steps: { id: number; title: string; subtitle?: string }[];
}

export interface ReviewStepProps {
  onBack: () => void;
  onSubmit: () => void;
  sessionCode: string;
}

export interface Player {
  id: string;
  name: string;
  team: 'A' | 'B';
}

export interface PlayerListProps {
  teamId: 'A' | 'B';
  teamName: string;
  players: Player[];
  onEditPlayer: (id: string) => void;
  onDeletePlayer: (id: string) => void;
}

export interface EmptyStateProps {
  title?: string;
  description?: string;
  className?: string;
}

export interface AddPlayersStepProps {
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export interface SessionSetupStepProps {
  onNext: () => void | Promise<void>;
  sessionCode: string;
  isLoading?: boolean;
}

export interface PlayerCardProps {
  id: string;
  name: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}
