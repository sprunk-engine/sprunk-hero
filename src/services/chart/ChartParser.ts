import { Chart } from "../../models/Chart.ts";
import { Parser } from "../Parser.ts";
import { parseChart } from "parsehero";
import { Note } from "../../models/Note.ts";
import { Mode } from "../../models/Mode.ts";

// Add an interface for the parsed note format
interface ParsedNote {
  type: string;
  note: number;
  assignedTime: number;
  duration: number;
  bpm?: number;
}

export class ChartParser implements Parser {
  public async parseTrack(manifestPath: string): Promise<Chart> {
    // Load manifest
    const manifestResponse = await fetch(manifestPath);
    if (!manifestResponse.ok)
      throw new Error(`Manifest load failed: ${manifestResponse.status}`);
    const manifest = await manifestResponse.json();

    // Load chart file
    const baseUrl = new URL(manifestPath, window.location.href);
    const chartPath = new URL(manifest.modes[0].chartPath, baseUrl).href;
    const chartResponse = await fetch(chartPath);
    if (!chartResponse.ok)
      throw new Error(`Chart load failed: ${chartResponse.status}`);

    const chartContent = await chartResponse.text();
    if (!chartContent.startsWith("[Song]")) {
      throw new Error("Invalid chart format - missing [Song] section");
    }

    // Parse chart with parsehero - ⚠️ Fix: Access chart property
    const parsedData = parseChart(chartContent);
    console.log("Raw parsehero output:", parsedData);

    // Important: The parsed data is in parsedData.chart, not directly in parsedData
    const chartData = parsedData.chart;

    // Get song data and resolution
    const songData = chartData.Song;
    const resolution = songData.resolution || 192;

    // After getting songData
    const offset = songData.offset || 0;

    // Find all difficulty tracks (like ExpertSingle, HardSingle)
    const modes: Mode[] = [];
    const difficultyNames = ["Expert", "Hard", "Medium", "Easy"];
    const instrumentNames = ["Single", "DoubleBass", "DoubleGuitar"];

    // Try all combinations of difficulty+instrument names
    for (const diff of difficultyNames) {
      for (const inst of instrumentNames) {
        const trackName = `${diff}${inst}`;
        const trackData = chartData[trackName];

        if (trackData && Array.isArray(trackData)) {
          console.log(
            `Found track: ${trackName} with ${trackData.length} notes`
          );

          // Convert to our Note format
          const notes: Note[] = trackData
            .filter((note: ParsedNote) => note.type === "note")
            .map((note: ParsedNote) => ({
              time: note.assignedTime + offset,
              fret: this.fretMapping(note.note),
              duration:
                note.duration > 0
                  ? (note.duration / resolution) * (60 / (note.bpm || 91.3))
                  : 0,
            }));

          modes.push({
            difficulty: trackName,
            notes: notes,
          });

          // Add one track for each found difficulty
          break;
        }
      }
    }

    if (modes.length === 0) {
      console.error("No difficulty tracks found in chart!");
      console.log("Available sections:", Object.keys(chartData));
    }

    return {
      song: {
        name: manifest.song.name,
        artist: manifest.song.artist,
        offset: offset,
        songPartsPath: manifest.song.songPartsPath,
      },
      modes: modes,
    };
  }

  private fretMapping(chartNote: number): number {
    return chartNote < 5 ? chartNote : 0;
  }
}
