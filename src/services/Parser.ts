import {Chart} from "../models/Chart.ts";

/**
 * A track parser that can parse a track file into a Chart object.
 */
export interface Parser{
    /**
     * Parse a track file into a Chart object. (The track file can be something like .ini or .json, but not directly one .mid)
     * @param file
     */
    parseTrack(file: string) : Promise<Chart>;
}