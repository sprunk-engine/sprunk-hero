import { Chart } from "../models/Chart.ts";

const exampleChart: Chart = {
  song: {
    name: "Fictional Song",
    artist: "Fictional Artist",
    offset: 0,
    resolution: 192,
    musicStream: "fictional_song.mp3",
  },
  modes: [
    {
      difficulty: "Easy",
      notes: [
        { time: 0, fret: 0, duration: 100 },
        { time: 5000, fret: 1, duration: 100 },
        { time: 10000, fret: 2, duration: 100 },
      ],
    },
    {
      difficulty: "Medium",
      notes: [
        { time: 0, fret: 0, duration: 100 },
        { time: 2500, fret: 1, duration: 100 },
        { time: 5000, fret: 2, duration: 100 },
        { time: 7500, fret: 3, duration: 100 },
        { time: 10000, fret: 4, duration: 100 },
      ],
    },
    {
      difficulty: "Hard",
      notes: [
        { time: 0, fret: 0, duration: 100 },
        { time: 1250, fret: 1, duration: 100 },
        { time: 2500, fret: 2, duration: 100 },
        { time: 3750, fret: 3, duration: 100 },
        { time: 5000, fret: 4, duration: 100 },
        { time: 6250, fret: 0, duration: 100 },
        { time: 7500, fret: 1, duration: 100 },
        { time: 8750, fret: 2, duration: 100 },
        { time: 10000, fret: 3, duration: 100 },
      ],
    },
  ],
};
