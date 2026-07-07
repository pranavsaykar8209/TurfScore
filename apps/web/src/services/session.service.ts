import api from './api';

export interface CreateSessionData {
  sessionCode?: string;
  sessionName?: string;
}

export interface UpdateSessionData {
  sessionName: string;
}

export const sessionService = {
  createSession: async (data: CreateSessionData) => {
    const response = await api.post('/sessions', data);
    return response.data;
  },

  getSession: async (sessionCode: string) => {
    const response = await api.get(`/sessions/${sessionCode}`);
    return response.data;
  },

  updateSession: async (sessionCode: string, data: UpdateSessionData) => {
    const response = await api.patch(`/sessions/${sessionCode}`, data);
    return response.data;
  },

  getSessionDashboard: async (sessionCode: string) => {
    const response = await api.get(`/sessions/${sessionCode}/dashboard`);
    return response.data;
  },
};
