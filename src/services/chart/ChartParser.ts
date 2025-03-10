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
  private readonly _requiredSections = ["[Song]"] as const;

  /**
   * Parses a .chart file into a structured Chart object.
   * @param chartFilePath - Path to the .chart file
   * @returns Parsed Chart object
   * @throws Error if file loading or parsing fails
   */
  public parse(chartFilePath: string): Chart {
    const content = this.loadChartFile(chartFilePath);
    this.validateChartFile(content);

    const sections = this.parseSections(content);

    return {
      song: this.parseSong(sections),
      modes: this.parseModes(sections),
    };
  }

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

    content.split("\n").forEach((line) => {
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

  private parseSong(sections: Section[]): Song {
    const songSection = sections.find((section) => section.key === "Song");
    if (!songSection) {
      throw new Error("Song section not found");
    }

    const songData = Object.fromEntries(
      songSection.content
        .map((line) => line.split("=").map((part) => part.trim()))
        .filter(([key, value]) => key && value)
        .map(([key, value]) => [key, value.replace(/"/g, "")])
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
