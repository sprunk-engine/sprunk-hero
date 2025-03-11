import { Parser } from "../Parser.ts";
import { Chart } from "../../models/Chart.ts";
import { Song } from "../../models/Song.ts";
import { Mode } from "../../models/Mode.ts";
import { Note } from "../../models/Note.ts";
import { Section } from "../../models/Section.ts";

/**
 * ChartParser implements the parsing of .chart files into structured data.
 */
export class ChartParser implements Parser {
  /**
   * Required sections that must be present in the chart file.
   * [Song] is mandatory as it contains essential metadata like audio file path.
   */
  private readonly _requiredSections = ["[Song]"] as const;

  public parse(chartFilePath: string): Chart {
    const content = this.loadChartFile(chartFilePath);
    this.validateChartFile(content);

    const sections = this.parseSections(content);

    return {
      song: this.parseSong(sections),
      modes: this.parseModes(sections),
    };
  }

  /**
   * Loads the chart file using XMLHttpRequest synchronously to ensure that the chart file is loaded before we can parse it.
   *
   * @param chartFilePath - Path to the chart file
   * @returns The content of the chart file as a string
   * @throws Error if file loading fails
   */
  private loadChartFile(chartFilePath: string): string {
    const request = new XMLHttpRequest();
    const path = chartFilePath.startsWith("/")
      ? chartFilePath
      : `/${chartFilePath}`;

    request.open("GET", path, false);
    request.send(null);

    if (request.status !== 200) {
      throw new Error(`Failed to load chart file: ${request.statusText}`);
    }

    return request.responseText;
  }

  private validateChartFile(content: string): boolean {
    try {
      this._requiredSections.every((section) => content.includes(section));
      return true;
    } catch (error) {
      throw new Error("Invalid chart file");
    }
  }

  private parseSections(content: string): Section[] {
    const sections: Section[] = [];
    let currentSection = "";
    let currentContent: string[] = [];

    content.split(/\r?\n/).forEach((line) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
        if (currentSection) {
          sections.push({
            key: currentSection,
            content: currentContent,
          });
          currentContent = [];
        }
        currentSection = trimmedLine.slice(1, -1);
      } else if (
        currentSection &&
        trimmedLine &&
        trimmedLine !== "{" &&
        trimmedLine !== "}"
      ) {
        currentContent.push(trimmedLine);
      }
    });

    if (currentSection) {
      sections.push({
        key: currentSection,
        content: currentContent,
      });
    }

    return sections;
  }

  /**
   * Parses the Song section into a Song object.
   * It create a temporary object with the song data and then convert it to a Song object.
   * It provides default values for optional fields since the chart file is not always complete or has the same attributes.
   *
   * @param sections - Array of all parsed sections
   * @returns Parsed Song object with metadata
   * @throws Error if Song section is not found
   */
  private parseSong(sections: Section[]): Song {
    const songSection = sections.find((section) => section.key === "Song");
    if (!songSection) {
      throw new Error("Song section not found");
    }

    const songData = Object.fromEntries(
      songSection.content
        .map((line) => {
          const [key, ...valueParts] = line.split("=");
          const value = valueParts.join("=").trim();
          return [
            key.trim(),
            value.startsWith('"') && value.endsWith('"')
              ? value.slice(1, -1)
              : value,
          ];
        })
        .filter(([key, value]) => key && value)
    );

    return {
      name: songData["Name"] || "",
      artist: songData["Artist"] || "",
      offset: parseFloat(songData["Offset"] || "0"),
      resolution: parseInt(songData["Resolution"] || "192", 10),
      musicStream: songData["MusicStream"] || songData["GuitarStream"] || "",
    };
  }

  private parseModes(sections: Section[]): Mode[] {
    return sections
      .filter((section) => section.key.includes("Single"))
      .map((section) => ({
        difficulty: `${section.key.split("Single")[0]} Guitar`,
        notes: this.parseNotes(section.content),
      }));
  }

  private parseNotes(data: string[]): Note[] {
    return data
      .map((line) => {
        if (!line.includes("N")) return null;

        const [time, noteData] = line.split("=");
        if (!noteData) return null;

        const [type, fret, duration] = noteData.trim().split(" ");
        if (type !== "N") return null;

        return {
          time: parseInt(time.trim()) / 1000,
          fret: parseInt(fret),
          duration: parseInt(duration) / 1000,
        };
      })
      .filter((note): note is Note => note !== null);
  }
}
