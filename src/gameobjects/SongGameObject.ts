import {
  Camera,
  Event,
  GameObject,
  InputGameEngineComponent,
  RenderGameEngineComponent,
  Vector2,
} from "sprunk-engine";
import { ButtonGameObject } from "./ButtonGameObject.ts";

/**
 * A GameObject that represents a single song with its album cover and selection behavior.
 */
export class SongGameObject extends GameObject {
  /**
   * When the song is selected.
   */
  public onSelected: Event<string> = new Event<string>();
  private _songId: string;

  /**
   * Creates a new SongGameObject.
   */
  constructor(
    camera: Camera,
    inputComponent: InputGameEngineComponent,
    renderComponent: RenderGameEngineComponent,
    songId: string
  ) {
    super(`Song_${songId}`);

    this._songId = songId;

    // Create album cover button
    const albumButton = new ButtonGameObject(
      camera,
      inputComponent,
      renderComponent,
      `/assets/songs/${songId}/album.png`,
      new Vector2(1, 1),
      2,
      2.5,
      1
    );

    // Set click handler to emit selection event
    albumButton.onClicked.addObserver(() => {
      this.onSelected.emit(this._songId);
    });

    this.addChild(albumButton);
  }

  /**
   * Gets the song ID.
   */
  public getSongId(): string {
    return this._songId;
  }
}
