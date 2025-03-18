import { Chart } from "../models/Chart.ts";
import { Parser } from "../models/Parser.ts";
import {ChartTrack, NoteEvent, parseChart, ParsedChart, PlayEvent, Timed} from "parsehero";
import { Note } from "../models/Note.ts";
import { Mode } from "../models/Mode.ts";

/**
 * Parses Guitar Hero/Clone Hero .chart files into game format
 */
export class ChartParser implements Parser {
  // Constants for chart processing
  private static readonly DEFAULT_RESOLUTION = 192;
  private static readonly DEFAULT_BPM = 91.3;
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
    const resolution = songData?.resolution || ChartParser.DEFAULT_RESOLUTION;
    const chartOffset = songData?.offset;
    const finalOffset = chartOffset ? chartOffset + offsetAdjustment : 0;

    const modes = this.extractDifficultyModes(
      chartData.chart,
      resolution,
      finalOffset
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

  /**
   * Loads the song manifest file
   */
  private async loadManifest(
    manifestPath: string
  ): Promise<Record<string, any>> {
    const manifestResponse = await fetch(manifestPath);
    if (!manifestResponse.ok) {
      throw new Error(`Manifest load failed: ${manifestResponse.status}`);
    }
    return await manifestResponse.json();
  }

  /**
   * Loads the chart file using the manifest path as base URL
   */
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

  /**
   * Parses chart content using parsehero library
   */
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

  /**
   * Extracts difficulty modes from parsed chart data
   */
  private extractDifficultyModes(
    chartData: ParsedChart,
    resolution: number,
    finalOffset: number
  ): Mode[] {
    const modes: Mode[] = [];

    // Try each difficulty+instrument combination
    for (const diff of ChartParser.DIFFICULTIES) {
      for (const inst of ChartParser.INSTRUMENTS) {
        const trackName = `${diff}${inst}` as ChartTrack;
        const trackData = chartData[trackName] as Timed<PlayEvent>[];

        if (this.isValidTrackData(trackData)) {
          const notes = this.convertNotes(trackData!, resolution, finalOffset);
          modes.push({ difficulty: trackName, notes });
          break; // Found a valid track for this difficulty, move to next
        }
      }
    }

    this.validateModes(modes, chartData);
    return modes;
  }

  /**
   * Validates if track data exists and is an array
   */
  private isValidTrackData(trackData: Timed<PlayEvent>[] | undefined): boolean {
    return !!trackData && Array.isArray(trackData);
  }

  /**
   * Converts notes from parsehero format to game format
   */
  private convertNotes(
    trackData: Timed<PlayEvent>[],
    resolution: number,
    finalOffset: number
  ): Note[] {
    return trackData
      .filter((event): event is Timed<NoteEvent> => event.type === "note")
      .map(
        (note): Note => ({
          time: note.assignedTime + finalOffset,
          fret: this.fretMapping(note.note),
          duration: this.calculateNoteDuration(note, resolution),
        })
      );
  }

  /**
   * Calculates note duration in seconds
   */
  private calculateNoteDuration(
    note: Timed<NoteEvent>,
    resolution: number
  ): number {
    if (note.duration <= 0) return 0;

    // Since parsehero doesn't directly expose BPM on note events, we use our default
    return (note.duration / resolution) * (60 / ChartParser.DEFAULT_BPM);
  }

  /**
   * Maps chart note values to game fret positions
   */
  private fretMapping(chartNote: number): number {
    return chartNote < 5 ? chartNote : 0;
  }

  /**
   * Validates that modes were successfully extracted
   */
  private validateModes(modes: Mode[], chartData: ParsedChart): void {
    if (modes.length === 0) {
      console.error("No difficulty tracks found in chart!");
      console.error("Available sections:", Object.keys(chartData));
    } else {
      console.info(`Found ${modes.length} difficulty modes`);
    }
  }
}
