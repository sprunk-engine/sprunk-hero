import {Note} from "./Note.ts";

export interface Mode {
    difficulty: string;
    notes: Note[];
}