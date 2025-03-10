import {Chart} from "../models/Chart.ts";

export const exampleChart: Chart = {
    song: {
        name: "Fictional Song",
        artist: "Fictional Artist",
        offset: 0,
        resolution: 192,
        musicStream: "fictional_song.mp3",
    },
    syncTrack: {
        beat: 0,
        type: "BPM",
        value: 120,
    },
    modes: [
        {
            difficulty: "Easy",
            notes: [
                { time: 0, fret: 0, duration: 100 },
                { time: 5, fret: 1, duration: 100 },
                { time: 10, fret: 2, duration: 100 },
            ],
        },
        {
            difficulty: "Medium",
            notes: [
                { time: 0, fret: 0, duration: 100 },
                { time: 2.5, fret: 1, duration: 100 },
                { time: 5, fret: 2, duration: 100 },
                { time: 7.5, fret: 3, duration: 100 },
                { time: 10, fret: 4, duration: 100 },
            ],
        },
        {
            difficulty: "Hard",
            notes: [
                { time: 0, fret: 0, duration: 100 },
                { time: 1.25, fret: 1, duration: 100 },
                { time: 2.5, fret: 2, duration: 100 },
                { time: 3750, fret: 3, duration: 100 },
                { time: 5, fret: 4, duration: 100 },
                { time: 6.25, fret: 0, duration: 100 },
                { time: 7.5, fret: 1, duration: 100 },
                { time: 8750, fret: 2, duration: 100 },
                { time: 10, fret: 3, duration: 100 },
            ],
        },
    ],
};