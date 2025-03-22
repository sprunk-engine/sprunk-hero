import {
  Camera,
  Event,
  GameObject,
  InputGameEngineComponent,
  RenderGameEngineComponent,
} from "sprunk-engine";
import { SongGameObject } from "./SongGameObject.ts";

/**
 * A GameObject that displays a list of available songs and allows the user to select one.
 */
export class SongSelectionGameObject extends GameObject {
  /**
   * When a song is selected.
   */
  public onSongSelected: Event<string> = new Event<string>();

  /**
   * Creates a new SongSelectionGameObject.
   */
  constructor(
    camera: Camera,
    inputComponent: InputGameEngineComponent,
    renderComponent: RenderGameEngineComponent
  ) {
    super("SongSelection");

    this.initialize(camera, inputComponent, renderComponent);
  }

  /**
   * Initializes the song selection by loading songs and creating buttons
   */
  private async initialize(
    camera: Camera,
    inputComponent: InputGameEngineComponent,
    renderComponent: RenderGameEngineComponent
  ) {
    const songs = await this.loadSongs();
    this.createSongButtons(songs, camera, inputComponent, renderComponent);
  }

  /**
   * Loads the list of available songs from the assets folder
   */
  private async loadSongs(): Promise<string[]> {
    try {
      const response = await fetch("/assets/songs/songs.json");
      if (!response.ok) {
        throw new Error(`Failed to load songs: ${response.statusText}`);
      }
      const config = await response.json();
      return config.songs;
    } catch (error) {
      console.error("Error loading songs:", error);
      return [];
    }
  }

  /**
   * Creates and positions song buttons in a row
   */
  private createSongButtons(
    songs: string[],
    camera: Camera,
    inputComponent: InputGameEngineComponent,
    renderComponent: RenderGameEngineComponent
  ) {
    // Create song objects in a row
    const spacing = 3;
    const startX = ((songs.length - 1) * spacing) / -2;

    for (let i = 0; i < songs.length; i++) {
      const songObject = new SongGameObject(
        camera,
        inputComponent,
        renderComponent,
        songs[i]
      );

      // Position each song horizontally with slightly different z positions
      // This ensures ray casting will only hit one album at a time
      const zPos = -0.01 * i;
      songObject.transform.position.set(startX + i * spacing, 0, zPos);

      // Listen for selection events
      songObject.onSelected.addObserver((songId) => {
        this.onSongSelected.emit(songId);
      });

      this.addChild(songObject);
    }
  }

  /**
   * Destroys all song objects.
   */
  public cleanup() {
    this.destroy();
  }
}
