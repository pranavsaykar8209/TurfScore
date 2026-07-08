import api from './api';

export interface CreatePlayerDto {
  teamId: number;
  playerName: string;
}

export interface UpdatePlayerDto {
  teamId?: number;
  playerName?: string;
}

export interface PlayerResponse {
  playerId: number;
  teamId: number;
  playerName: string;
  createdAt: string;
}

export const playerService = {
  createPlayer: async (sessionCode: string, data: CreatePlayerDto): Promise<PlayerResponse> => {
    const response = await api.post(`/sessions/${sessionCode}/players`, data);
    return response.data;
  },

  getPlayers: async (sessionCode: string, teamId?: number): Promise<PlayerResponse[]> => {
    const params = teamId ? { teamId } : {};
    const response = await api.get(`/sessions/${sessionCode}/players`, { params });
    return response.data;
  },

  getPlayer: async (playerId: number): Promise<PlayerResponse> => {
    const response = await api.get(`/players/${playerId}`);
    return response.data;
  },

  updatePlayer: async (playerId: number, data: UpdatePlayerDto): Promise<PlayerResponse> => {
    const response = await api.patch(`/players/${playerId}`, data);
    return response.data;
  },

  deletePlayer: async (playerId: number): Promise<void> => {
    await api.delete(`/players/${playerId}`);
  },

  syncPlayers: async (sessionCode: string, data: CreatePlayerDto[]): Promise<PlayerResponse[]> => {
    const response = await api.post(`/sessions/${sessionCode}/players/sync`, data);
    return response.data;
  }
};
