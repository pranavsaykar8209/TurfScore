import { eq } from 'drizzle-orm';
import { db } from '../index';
import { sessions } from '../schema/sessions';
import { CreateSessionDto, UpdateSessionDto } from '../../types/session.types';

export class SessionRepository {
  async create(sessionCode: string, data: CreateSessionDto) {
    const [newSession] = await db
      .insert(sessions)
      .values({
        sessionCode,
        sessionName: data.sessionName || `Session ${sessionCode}`,
      })
      .returning();
    return newSession;
  }

  async findByCode(sessionCode: string) {
    const [session] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.sessionCode, sessionCode));
    return session;
  }

  async update(sessionCode: string, data: UpdateSessionDto) {
    const [updatedSession] = await db
      .update(sessions)
      .set({
        sessionName: data.sessionName,
        updatedAt: new Date(),
      })
      .where(eq(sessions.sessionCode, sessionCode))
      .returning();
    return updatedSession;
  }

  async getDashboard(sessionCode: string) {
    const session = await db.query.sessions.findFirst({
      where: eq(sessions.sessionCode, sessionCode),
      with: {
        teams: true,
        matches: true,
      },
    });
    return session;
  }
}
