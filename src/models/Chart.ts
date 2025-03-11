import {Mode} from "./Mode.ts";
import {SyncTrack} from "./SyncTrack.ts";
import {Song} from "./Song.ts";

export interface Chart {
    song: Song;
    syncTrack: SyncTrack;
    modes: Mode[];
}