import { PlayerRepository } from '../db/repositories/player.repository';
import { SessionRepository } from '../db/repositories/session.repository';
import { TeamRepository } from '../db/repositories/team.repository';
import { CreatePlayerDto, UpdatePlayerDto } from '../types/player.types';

const playerRepository = new PlayerRepository();
const sessionRepository = new SessionRepository();
const teamRepository = new TeamRepository();

export const playerService = {
  async createPlayer(sessionCode: string, data: CreatePlayerDto) {
    const session = await sessionRepository.findByCode(sessionCode);
    if (!session) {
      throw new Error('Session not found');
    }

    const team = await teamRepository.findById(data.teamId);
    if (!team) {
      throw new Error('Team not found');
    }

    if (team.sessionId !== session.sessionId) {
      throw new Error('Team does not belong to the given session');
    }

    return await playerRepository.create(team.teamId, data);
  },

  async getPlayers(sessionCode: string, teamId?: number) {
    const session = await sessionRepository.findByCode(sessionCode);
    if (!session) {
      throw new Error('Session not found');
    }

    if (teamId) {
      const team = await teamRepository.findById(teamId);
      if (!team || team.sessionId !== session.sessionId) {
        throw new Error('Team not found in this session');
      }
    }

    return await playerRepository.findBySessionCode(sessionCode, teamId);
  },

  async getPlayer(playerId: number) {
    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }
    return player;
  },

  async updatePlayer(playerId: number, data: UpdatePlayerDto) {
    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    if (data.teamId && data.teamId !== player.teamId) {
      const currentTeam = await teamRepository.findById(player.teamId);
      const newTeam = await teamRepository.findById(data.teamId);
      
      if (!newTeam) {
        throw new Error('New team not found');
      }

      if (currentTeam?.sessionId !== newTeam.sessionId) {
        throw new Error('New team must belong to the same session');
      }
    }

    return await playerRepository.update(playerId, data);
  },

  async deletePlayer(playerId: number) {
    const player = await playerRepository.findById(playerId);
    if (!player) {
      throw new Error('Player not found');
    }

    const statsCount = await playerRepository.countPlayerStats(playerId);
    if (statsCount > 0) {
      throw new Error('Cannot delete player with recorded statistics');
    }

    // Wait, check if used in match? The stats check might be sufficient if balls are logged, 
    // but what if they are just in a match lineup? 
    // Since we don't have lineup table, stats/balls is enough.

    await playerRepository.delete(playerId);
  },
  
  async syncPlayersForSession(sessionCode: string, players: CreatePlayerDto[]) {
    const session = await sessionRepository.findByCode(sessionCode);
    if (!session) {
      throw new Error('Session not found');
    }
    
    // Wipe all existing players for session
    await playerRepository.deleteBySessionCode(sessionCode);
    
    // Recreate them
    if (players.length === 0) return [];

    const sessionTeams = await teamRepository.findBySessionId(session.sessionId);
    const validTeamIds = new Set(sessionTeams.map((t: any) => t.teamId));

    const playersToInsert = players.map(player => {
      if (!validTeamIds.has(player.teamId)) {
        throw new Error(`Team ${player.teamId} not found in this session`);
      }
      return { teamId: player.teamId, playerName: player.playerName };
    });

    return await playerRepository.createMany(playersToInsert);
  }
};
