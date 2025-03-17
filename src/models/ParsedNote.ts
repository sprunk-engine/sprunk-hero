export interface ParsedNote {
  type: string;
  note: number;
  assignedTime: number;
  duration: number;
  bpm?: number;
}
