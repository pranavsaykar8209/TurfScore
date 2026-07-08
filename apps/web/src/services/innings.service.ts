import api from './api';

export interface UpdateInningsData {
  totalRuns?: number;
  totalWickets?: number;
  totalExtras?: number;
  legalBalls?: number;
  currentStrikerId?: number | null;
  currentNonStrikerId?: number | null;
  currentBowlerId?: number | null;
  currentOverNumber?: number;
}

export const inningsService = {
  startFirstInnings: async (matchId: number) => {
    const response = await api.post(`/matches/${matchId}/innings`);
    return response.data;
  },

  getCurrentInnings: async (matchId: number) => {
    const response = await api.get(`/matches/${matchId}/innings/current`);
    return response.data;
  },

  getInnings: async (inningsId: number) => {
    const response = await api.get(`/innings/${inningsId}`);
    return response.data;
  },

  updateInnings: async (inningsId: number, data: UpdateInningsData) => {
    const response = await api.patch(`/innings/${inningsId}`, data);
    return response.data;
  },

  endInnings: async (inningsId: number) => {
    const response = await api.post(`/innings/${inningsId}/end`);
    return response.data;
  },

  startSecondInnings: async (matchId: number) => {
    const response = await api.post(`/matches/${matchId}/innings/second`);
    return response.data;
  },
};
