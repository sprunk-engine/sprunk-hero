import { Parser } from "./Parser.ts";
import { MidiParser } from "./MidiParser.ts";
import { ChartParser } from "./ChartParser.ts";
import { Manifest } from "./Manifest.ts";

/**
 * Factory for creating the appropriate parser based on the chart type
 */
export class ParserService {
  /**
   * Creates a parser based on the file type in the manifest
   *
   * @param manifestPath - Path to the song manifest file
   * @returns A promise that resolves to the appropriate parser
   */
  public static async createParser(manifestPath: string): Promise<Parser> {
    try {
      // Load manifest to determine file type
      const manifest = await this.loadManifest(manifestPath);

      // Check what type of files the manifest contains
      const chartType = this.determineChartType(manifest);

      // Create and return the appropriate parser
      return this.instantiateParser(chartType);
    } catch (error) {
      console.error("Failed to create parser:", error);
      throw new Error(
        `Parser creation failed: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Loads the manifest file to examine its structure
   */
  private static async loadManifest(manifestPath: string): Promise<Manifest> {
    const response = await fetch(manifestPath);
    if (!response.ok) {
      throw new Error(`Manifest load failed: ${response.status}`);
    }
    return await response.json();
  }

  /**
   * Determines chart type based on manifest content
   */
  private static determineChartType(manifest: Manifest): "midi" | "chart" {
    // Check if modes array exists
    if (!manifest.modes || manifest.modes.length === 0) {
      throw new Error("Invalid manifest: missing or empty modes array");
    }

    // Loop through each mode to find properties ending with "Path"
    for (const mode of manifest.modes) {
      // Check for chartPath
      if (mode.chartPath) {
        return "chart";
      }

      // Check for midiPath
      if (mode.midiPath) {
        return "midi";
      }
    }

    // If no mode has chartPath or midiPath, throw error
    throw new Error(
      "Unable to determine chart type: manifest must contain a mode with either 'chartPath' or 'midiPath'"
    );
  }

  /**
   * Instantiates the correct parser based on chart type
   */
  private static instantiateParser(chartType: "midi" | "chart"): Parser {
    switch (chartType) {
      case "midi":
        return new MidiParser();
      case "chart":
        return new ChartParser();
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  }
}
