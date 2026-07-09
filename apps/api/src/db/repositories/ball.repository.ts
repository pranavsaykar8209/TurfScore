import { eq, desc } from 'drizzle-orm';
import { db } from '../index';
import { balls } from '../schema/balls';

export class BallRepository {
  async insert(data: any, tx: any = db) {
    const [inserted] = await tx
      .insert(balls)
      .values(data)
      .returning();
    return inserted;
  }

  async getLastBall(inningId: number, tx: any = db) {
    const ball = await tx.query.balls.findFirst({
      where: eq(balls.inningId, inningId),
      orderBy: [desc(balls.ballId)],
    });
    return ball;
  }

  async getPreviousBall(inningId: number, offset: number, tx: any = db) {
    const ball = await tx.query.balls.findFirst({
      where: eq(balls.inningId, inningId),
      orderBy: [desc(balls.ballId)],
      offset: offset
    });
    return ball;
  }

  async delete(ballId: number, tx: any = db) {
    await tx.delete(balls).where(eq(balls.ballId, ballId));
  }
}
