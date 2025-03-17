export interface Manifest {
  song: {
    name: string;
    artist: string;
    offset: number;
    songPartsPath: string[];
  };
  modes: Array<{
    difficulty: string;
    chartPath?: string;
    midiPath?: string;
  }>;
}
