import {
  Event,
  GameObject,
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
    songId: string
  ) {
    super(`Song_${songId}`);
    this._songId = songId;
  }

  protected onEnable() {
    super.onEnable();

    // Create album cover button
    const albumButton = new ButtonGameObject(
        `/assets/songs/${this._songId}/album.png`,
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
}
