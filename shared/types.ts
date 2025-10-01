export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Room {
  id: string;
  number: string;
}
export interface CheckIn {
  roomId: string;
  roomNumber: string;
  timestamp: number; // epoch millis
}
export interface BreakfastSession {
  id: string; // YYYY-MM-DD
  date: number; // epoch millis
  checkIns: CheckIn[];
}
export type SessionList = {
  dates: string[];
};