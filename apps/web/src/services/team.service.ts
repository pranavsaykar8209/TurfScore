import api from './api';

export interface CreateTeamData {
  teamName: string;
}

export interface UpdateTeamData {
  teamName: string;
}

export const teamService = {
  createTeam: async (sessionCode: string, data: CreateTeamData) => {
    const response = await api.post(`/sessions/${sessionCode}/teams`, data);
    return response.data;
  },

  getTeams: async (sessionCode: string) => {
    const response = await api.get(`/sessions/${sessionCode}/teams`);
    return response.data;
  },

  getTeam: async (teamId: number) => {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },

  updateTeam: async (teamId: number, data: UpdateTeamData) => {
    const response = await api.patch(`/teams/${teamId}`, data);
    return response.data;
  },

  deleteTeam: async (teamId: number) => {
    const response = await api.delete(`/teams/${teamId}`);
    return response.data;
  },
};
