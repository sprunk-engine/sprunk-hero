/**
 * Represents a note in the chart.
 *
 * @property time - The time in seconds when the note should be played.
 * @property fret - The fret number that should be pressed.
 * @property duration - The duration of the note in seconds.
 */
export interface Note {
  time: number;
  fret: number;
  duration: number;
}
