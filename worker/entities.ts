import { IndexedEntity, Entity, Env, Index } from "./core-utils";
import type { Room, BreakfastSession, CheckIn } from "@shared/types";
import { MOCK_ROOMS } from "@shared/mock-data";
export class RoomEntity extends IndexedEntity<Room> {
  static readonly entityName = "room";
  static readonly indexName = "rooms";
  static readonly initialState: Room = { id: "", number: "" };
  static seedData = MOCK_ROOMS;
}
export class BreakfastSessionEntity extends Entity<BreakfastSession> {
  static readonly entityName = "breakfast_session";
  static readonly indexName = "breakfast_sessions";
  static readonly initialState: BreakfastSession = { id: "", date: 0, checkIns: [] };
  async addCheckIn(roomId: string, roomNumber: string): Promise<BreakfastSession> {
    const updatedSession = await this.mutate((session) => {
      const alreadyCheckedIn = session.checkIns.some((c) => c.roomId === roomId);
      if (alreadyCheckedIn) {
        throw new Error(`La chambre ${roomNumber} a déjà été validée aujourd'hui.`);
      }
      const newCheckIn: CheckIn = {
        roomId,
        roomNumber,
        timestamp: Date.now()
      };
      return {
        ...session,
        checkIns: [...session.checkIns, newCheckIn]
      };
    });
    // Also add to index
    const idx = new Index<string>(this.env, BreakfastSessionEntity.indexName);
    await idx.add(this.id);
    return updatedSession;
  }
  async getState(): Promise<BreakfastSession> {
    const state = await super.getState();
    if (state.date === 0) {
      const initializedState = {
        id: this.id,
        date: new Date(this.id).getTime(),
        checkIns: []
      };
      this._state = initializedState;
      return initializedState;
    }
    return state;
  }
}