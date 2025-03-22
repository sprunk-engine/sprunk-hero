import { Mode } from "./Mode.ts";
import { Song } from "./Song.ts";

export interface Chart {
  song: Song;
  modes: Mode[];
}
