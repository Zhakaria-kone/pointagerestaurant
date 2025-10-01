import { Hono } from "hono";
import type { Env } from './core-utils';
import { RoomEntity, BreakfastSessionEntity } from "./entities";
import { ok, bad, isStr, Index } from './core-utils';
import { isValid, parseISO } from 'date-fns';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // GET /api/rooms - Fetch all rooms
  app.get('/api/rooms', async (c) => {
    await RoomEntity.ensureSeed(c.env);
    const page = await RoomEntity.list(c.env, null, 1000); // Assuming max 1000 rooms
    return ok(c, page.items);
  });
  // GET /api/sessions - List past sessions
  app.get('/api/sessions', async (c) => {
    const index = new Index<string>(c.env, BreakfastSessionEntity.indexName);
    const dates = await index.list();
    return ok(c, { dates });
  });
  // GET /api/sessions/:date - Get a session for a specific date
  app.get('/api/sessions/:date', async (c) => {
    const dateStr = c.req.param('date');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !isValid(parseISO(dateStr))) {
      return bad(c, 'Format de date invalide. Utilisez YYYY-MM-DD.');
    }
    const session = new BreakfastSessionEntity(c.env, dateStr);
    const state = await session.getState();
    return ok(c, state);
  });
  // POST /api/sessions/:date/check-in - Record a new room check-in
  app.post('/api/sessions/:date/check-in', async (c) => {
    const dateStr = c.req.param('date');
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr) || !isValid(parseISO(dateStr))) {
      return bad(c, 'Format de date invalide. Utilisez YYYY-MM-DD.');
    }
    const { roomId, roomNumber } = (await c.req.json()) as { roomId?: string; roomNumber?: string };
    if (!isStr(roomId) || !isStr(roomNumber)) {
      return bad(c, 'roomId et roomNumber sont requis.');
    }
    const session = new BreakfastSessionEntity(c.env, dateStr);
    try {
      const updatedSession = await session.addCheckIn(roomId, roomNumber);
      return ok(c, updatedSession);
    } catch (error) {
      return bad(c, (error as Error).message);
    }
  });
}