/**
 * Type definitions based on parsehero library for parsing Guitar Hero/Clone Hero chart files
 */

/**
 * Base event interface with a tick position
 * @interface TickEvent
 * @property {number} tick - The tick position of the event in the chart
 */
export interface TickEvent {
  tick: number;
}

/**
 * Represents a note event in the chart
 * @interface NoteEvent
 * @extends TickEvent
 * @property {string} type - The type of event, always "note"
 * @property {number} note - The fret number (0-4 for standard notes, 5-6 for modifiers)
 * @property {number} duration - The duration of the note in ticks
 * @property {boolean} isHOPO - Whether the note is a Hammer-On/Pull-Off
 * @property {boolean} isChord - Whether the note is part of a chord
 * @property {boolean} forced - Whether the note is forced (open note)
 * @property {boolean} tap - Whether the note is a tap note
 */
export interface NoteEvent extends TickEvent {
  type: "note";
  note: number;
  duration: number;
  isHOPO: boolean;
  isChord: boolean;
  forced: boolean;
  tap: boolean;
}

/**
 * Represents a text or section marker event in the chart
 * @interface SimpleEvent
 * @extends TickEvent
 * @property {string} type - The type of event, always "event"
 * @property {string} value - The text content of the event
 */
export interface SimpleEvent extends TickEvent {
  type: "event";
  value: string;
}

/**
 * Represents a star power/overdrive section in the chart
 * @interface StarPowerEvent
 * @extends TickEvent
 * @property {string} type - The type of event, always "starpower"
 * @property {number} duration - The duration of the star power in ticks
 */
export interface StarPowerEvent extends TickEvent {
  type: "starpower";
  duration: number;
}

/**
 * Union type for all playable events in the chart
 * @type PlayEvent
 */
export type PlayEvent = NoteEvent | SimpleEvent | StarPowerEvent;

/**
 * Adds timing information to an event
 * @template T - The type of event
 * @type Timed
 * @property {number} assignedTime - The calculated time in seconds when this event occurs
 */
export type Timed<T> = T & { assignedTime: number };

/**
 * Represents the song metadata section of a chart
 * @interface SongSection
 * @property {number} resolution - The number of ticks per quarter note (typically 192)
 * @property {string} [name] - The name of the song
 * @property {string} [artist] - The artist of the song
 * @property {string} [album] - The album of the song
 * @property {number} [offset] - The global timing offset in seconds
 * @property {number} [difficulty] - The difficulty rating of the song
 */
export interface SongSection {
  resolution: number;
  name?: string;
  artist?: string;
  album?: string;
  offset?: number;
  difficulty?: number;
}

/**
 * Chart track identifier combining difficulty and instrument
 * Examples: "ExpertSingle", "HardDoubleBass", etc.
 * @type ChartTrack
 */
export type ChartTrack = string;

/**
 * The complete parsed chart structure from parsehero
 * @interface ParsedChart
 * @property {SongSection} Song - Song metadata
 * @property {any} SyncTrack - Sync track containing BPM and time signature info
 * @property {Timed<SimpleEvent>[]} [Events] - Optional events track
 * @property {Timed<PlayEvent>[]} [key: string] - Difficulty tracks indexed by difficulty+instrument combinations
 */
export interface ParsedChart {
  Song: SongSection;
  SyncTrack: any;
  Events?: Timed<SimpleEvent>[];
  [key: string]: any; // For difficulty tracks
}
