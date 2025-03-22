import { Parser } from "./Parser.ts";
import { Chart } from "../models/Chart.ts";
import { Note } from "../models/Note.ts";
import { Midi } from "@tonejs/midi";

export class MidiParser implements Parser {
  public async parseTrack(file: string): Promise<Chart> {
    //Fetch manifest file
    const response = await fetch(file);
    if (!response.ok)
      throw new Error(`Failed to fetch manifest: ${response.statusText}`);
    const manifest = await response.json();
    return {
      song: manifest.song,
      modes: await Promise.all(
        manifest.modes.map(
          async (mode: { difficulty: string; midiPath: string }) => {
            return {
              difficulty: mode.difficulty,
              notes: await this.parseMidi(mode.midiPath),
            };
          }
        )
      ),
    };
  }

  private async parseMidi(midiTrack: string): Promise<Note[]> {
    // Parse the MIDI file
    const midi = await Midi.fromUrl(midiTrack);

    const guitarTrack = midi.tracks.find(
      (track) => track.name === "PART GUITAR"
    );

    if (!guitarTrack) {
      throw new Error("No guitar track found in the midi file");
    }

    const notes: Map<number, Note[]> = new Map();
    for (const note of guitarTrack.notes) {
      const octave = Math.floor(note.midi / 12);
      if (!notes.has(octave)) {
        notes.set(octave, []);
      }
      notes.get(octave)!.push({
        time: note.time,
        duration: note.duration,
        fret: note.midi - octave * 12,
      });
    }

    return notes.get(5 + 3)!;
  }
}
