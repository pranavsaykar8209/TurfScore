import { TeamRepository } from '../db/repositories/team.repository';
import { SessionRepository } from '../db/repositories/session.repository';
import { CreateTeamDto, UpdateTeamDto } from '../types/team.types';

export class TeamService {
  private teamRepository: TeamRepository;
  private sessionRepository: SessionRepository;

  constructor() {
    this.teamRepository = new TeamRepository();
    this.sessionRepository = new SessionRepository();
  }

  async createTeam(sessionCode: string, data: CreateTeamDto) {
    const session = await this.sessionRepository.findByCode(sessionCode);
    if (!session) {
      throw new Error('Session not found');
    }

    const existingTeam = await this.teamRepository.findByNameAndSession(data.teamName, session.sessionId);
    if (existingTeam) {
      throw new Error('Team name must be unique within a session');
    }

    const team = await this.teamRepository.create(session.sessionId, data);
    return team;
  }

  async getTeams(sessionCode: string) {
    const session = await this.sessionRepository.findByCode(sessionCode);
    if (!session) {
      throw new Error('Session not found');
    }

    const teams = await this.teamRepository.findBySessionId(session.sessionId);
    return teams;
  }

  async getTeam(teamId: number) {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    return team;
  }

  async updateTeam(teamId: number, data: UpdateTeamDto) {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    // Check uniqueness if name is changed
    if (data.teamName !== team.teamName) {
      const existingTeam = await this.teamRepository.findByNameAndSession(data.teamName, team.sessionId);
      if (existingTeam) {
        throw new Error('Team name must be unique within a session');
      }
    }

    const updatedTeam = await this.teamRepository.update(teamId, data);
    return updatedTeam;
  }

  async deleteTeam(teamId: number) {
    const team = await this.teamRepository.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    const playersCount = await this.teamRepository.countPlayersInTeam(teamId);
    if (playersCount > 0) {
      throw new Error('Cannot delete team with assigned players');
    }

    const matchesCount = await this.teamRepository.countMatchesForTeam(teamId);
    if (matchesCount > 0) {
      throw new Error('Cannot delete team that has participated in a match');
    }

    await this.teamRepository.delete(teamId);
    return true;
  }
}
