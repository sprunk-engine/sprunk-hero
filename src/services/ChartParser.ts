import { Chart } from "../models/Chart.ts";
import { Parser } from "../models/Parser.ts";
import {
  Bpm,
  ChartTrack,
  NoteEvent,
  parseChart,
  ParsedChart,
  PlayEvent,
  Timed,
  tickToTime,
} from "parsehero";
import { Note } from "../models/Note.ts";
import { Mode } from "../models/Mode.ts";

/**
 * Parses Guitar Hero/Clone Hero .chart files into game format
 */
export class ChartParser implements Parser {
  private static readonly DEFAULT_OFFSET_ADJUSTMENT = 0.18;
  private static readonly DIFFICULTIES = ["Expert", "Hard", "Medium", "Easy"];
  private static readonly INSTRUMENTS = [
    "Single",
    "DoubleBass",
    "DoubleGuitar",
  ];

  /**
   * Parses a chart file into the game's Chart format
   *
   * @param manifestPath - The path to the manifest file
   * @param offsetAdjustment - The offset adjustment to apply to the chart
   * @returns A promise that resolves to the parsed chart
   */
  public async parseTrack(
    manifestPath: string,
    offsetAdjustment: number = ChartParser.DEFAULT_OFFSET_ADJUSTMENT
  ): Promise<Chart> {
    const manifest = await this.loadManifest(manifestPath);
    const chartContent = await this.loadChartFile(manifest);
    const chartData = this.parseChartContent(chartContent);

    const songData = chartData.chart.Song;
    const resolution = songData.resolution;
    const chartOffset = songData?.offset;
    const finalOffset = chartOffset ? chartOffset + offsetAdjustment : 0;

    const syncTrack = chartData.chart.SyncTrack;
    const bpms = syncTrack?.bpms;

    const modes = this.extractDifficultyModes(
      chartData.chart,
      resolution,
      finalOffset,
      bpms
    );

    return {
      song: {
        name: manifest.song.name,
        artist: manifest.song.artist,
        offset: finalOffset,
        songPartsPath: manifest.song.songPartsPath,
      },
      modes: modes,
    };
  }

  private async loadManifest(
    manifestPath: string
  ): Promise<Record<string, any>> {
    const manifestResponse = await fetch(manifestPath);
    if (!manifestResponse.ok) {
      throw new Error(`Manifest load failed: ${manifestResponse.status}`);
    }
    return await manifestResponse.json();
  }

  private async loadChartFile(manifest: Record<string, any>): Promise<string> {
    const chartResponse = await fetch(manifest.modes[0].chartPath);

    if (!chartResponse.ok) {
      throw new Error(`Chart load failed: ${chartResponse.status}`);
    }

    const chartContent = await chartResponse.text();
    if (!chartContent.startsWith("[Song]")) {
      throw new Error("Invalid chart format - missing [Song] section");
    }

    return chartContent;
  }

  private parseChartContent(chartContent: string): {
    chart: ParsedChart;
    warnings: string[];
  } {
    try {
      const result = parseChart(chartContent);
      return result as { chart: ParsedChart; warnings: string[] };
    } catch (error) {
      throw new Error(
        `Chart parsing failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private extractDifficultyModes(
    chartData: ParsedChart,
    resolution: number,
    finalOffset: number,
    bpms: Timed<Bpm>[]
  ): Mode[] {
    const modes: Mode[] = [];

    for (const diff of ChartParser.DIFFICULTIES) {
      for (const inst of ChartParser.INSTRUMENTS) {
        const trackName = `${diff}${inst}` as ChartTrack;
        const trackData = chartData[trackName] as Timed<PlayEvent>[];

        if (this.isValidTrackData(trackData)) {
          const notes = this.convertNotes(
            trackData!,
            resolution,
            finalOffset,
            bpms
          );
          modes.push({ difficulty: trackName, notes });
          break; // Found a valid track for this difficulty
        }
      }
    }

    return modes;
  }

  private isValidTrackData(trackData: Timed<PlayEvent>[] | undefined): boolean {
    return !!trackData && Array.isArray(trackData);
  }

  private convertNotes(
    trackData: Timed<PlayEvent>[],
    resolution: number,
    finalOffset: number,
    bpms: Timed<Bpm>[]
  ): Note[] {
    return trackData
      .filter((event): event is Timed<NoteEvent> => event.type === "note")
      .map(
        (note): Note => ({
          time: note.assignedTime + finalOffset,
          fret: note.note,
          duration: this.calculateNoteDuration(note, resolution, bpms),
        })
      );
  }

  private calculateNoteDuration(
    note: Timed<NoteEvent>,
    resolution: number,
    bpms: Timed<Bpm>[]
  ): number {
    if (note.duration <= 0) return 0;

    const endTick = note.tick + note.duration;
    const startTime = note.assignedTime;
    const endTime = tickToTime(endTick, resolution, bpms);
    return endTime - startTime;
  }
}
