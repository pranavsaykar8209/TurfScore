import api from './api';

export interface CreateMatchData {
  teamAId: number;
  teamBId: number;
  oversPerInnings: number;
  tossWinnerTeamId?: number;
  tossDecision?: 'bat' | 'bowl';
}

export interface UpdateMatchData {
  status?: 'scheduled' | 'live' | 'completed';
  currentInning?: number;
  tossWinnerTeamId?: number;
  tossDecision?: 'bat' | 'bowl';
  winnerTeamId?: number;
  winType?: string;
  winMargin?: number;
  startedAt?: string | Date;
  completedAt?: string | Date;
}

export const matchService = {
  createMatch: async (sessionCode: string, data: CreateMatchData) => {
    const response = await api.post(`/sessions/${sessionCode}/matches`, data);
    return response.data;
  },

  getMatches: async (sessionCode: string) => {
    const response = await api.get(`/sessions/${sessionCode}/matches`);
    return response.data;
  },

  getMatch: async (matchId: number) => {
    const response = await api.get(`/matches/${matchId}`);
    return response.data;
  },

  getLiveScoringData: async (matchId: number) => {
    const response = await api.get(`/matches/${matchId}/live-scoring`);
    return response.data;
  },

  updateMatch: async (matchId: number, data: UpdateMatchData) => {
    const response = await api.patch(`/matches/${matchId}`, data);
    return response.data;
  },

  deleteMatch: async (matchId: number) => {
    const response = await api.delete(`/matches/${matchId}`);
    return response.data;
  },
};
