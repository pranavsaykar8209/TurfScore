import { SessionRepository } from '../db/repositories/session.repository';
import { CreateSessionDto, UpdateSessionDto } from '../types/session.types';

export class SessionService {
  private repository: SessionRepository;

  constructor() {
    this.repository = new SessionRepository();
  }

  // Generates a random 6-character alphanumeric code
  private generateSessionCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  async createSession(data: CreateSessionDto) {
    let sessionCode = data.sessionCode || this.generateSessionCode();
    
    // In a real app we'd ensure uniqueness by checking the DB or letting a unique constraint fail and retrying
    // For now we'll just generate one and assume it's unique
    const session = await this.repository.create(sessionCode, data);
    return session;
  }

  async getSession(sessionCode: string) {
    const session = await this.repository.findByCode(sessionCode);
    if (!session) {
      throw new Error('Session not found');
    }
    return session;
  }

  async updateSession(sessionCode: string, data: UpdateSessionDto) {
    const existingSession = await this.repository.findByCode(sessionCode);
    if (!existingSession) {
      throw new Error('Session not found');
    }

    const updatedSession = await this.repository.update(sessionCode, data);
    return updatedSession;
  }

  async getDashboard(sessionCode: string) {
    const dashboard = await this.repository.getDashboard(sessionCode);
    if (!dashboard) {
      throw new Error('Session not found');
    }
    return dashboard;
  }
}
