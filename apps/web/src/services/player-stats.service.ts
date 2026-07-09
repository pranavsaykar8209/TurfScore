import api from './api';

export const playerStatsService = {
  getMatchScorecard: async (matchId: number) => {
    const response = await api.get(`/player-stats/match/${matchId}`);
    return response.data;
  },

  getSessionStats: async (sessionCode: string) => {
    const response = await api.get(`/player-stats/session/${sessionCode}`);
    return response.data;
  },

  getLeaderboards: async (sessionCode: string) => {
    const response = await api.get(`/player-stats/session/${sessionCode}/leaderboards`);
    return response.data;
  },
};
