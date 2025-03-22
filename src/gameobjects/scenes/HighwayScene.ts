import {
  Camera,
  GameObject,
  Vector3,
} from "sprunk-engine";
import { FreeLookCameraController } from "../../debug/FreeLookCameraController.ts";
import { FreeLookCameraKeyboardMouseInput } from "../../debug/FreeLookCameraKeyboardMouseInput.ts";
import { GridGameObject } from "../GridGameObject.ts";
import { GizmoGameObject } from "../GizmoGameObject.ts";
import { GameLogicGameObject } from "../GameLogicGameObject.ts";
import { SongSelectionGameObject } from "../SongSelectionGameObject.ts";

/**
 * A scene that represents the highway scene.
 */
export class HighwayScene extends GameObject {
  private _debug: boolean;
  private _songSelection!: SongSelectionGameObject;
  private _cameraGo!: GameObject;
  private _camera!: Camera;

  constructor(debug: boolean) {
    super("HighwayScene");
    this._debug = debug;
  }

  protected onEnable() {
    super.onEnable();

    // Create a static camera for menu
    this._cameraGo = new GameObject("Camera");
    this.addChild(this._cameraGo);
    this._camera = new Camera(
        Math.PI / 3,
        undefined,
        undefined,
        30
    );
    this._cameraGo.addBehavior(this._camera);
    this._cameraGo.addBehavior(this._camera);
    this._cameraGo.transform.position.set(0, 0, 10); // Camera 10 units back
    this.addChild(this._cameraGo);

    // Create song selection UI
    this._songSelection = new SongSelectionGameObject();


    // Position song selection in front of camera
    this._songSelection.transform.position.set(0, 0, 0);
    this.addChild(this._songSelection);
    this._songSelection.onSongSelected.addObserver(
      this.onSongSelected.bind(this)
    );

    if (this._debug) {
      const grid = new GridGameObject();
      this.addChild(grid);

      const gizmo = new GizmoGameObject();
      this.addChild(gizmo);
      gizmo.transform.position.set(5, 0, 0);

      this._cameraGo.addBehavior(new FreeLookCameraController());
      this._cameraGo.addBehavior(
        new FreeLookCameraKeyboardMouseInput()
      );
    }
  }

  /**
   * Called when a song is selected from the song selection UI.
   * @param songId The ID of the selected song.
   */
  private onSongSelected(songId: string) {
    // Hide song selection
    this._songSelection.destroy();
    // Load the game with the selected song
    this.loadGame(songId);
  }

  public loadGame(songId: string) {
    // Set camera for gameplay
    this._cameraGo.transform.position.set(0, 2, 3);
    this._cameraGo.transform.rotation.rotateAroundAxis(
      Vector3.right(),
      -Math.PI / 10
    );

    // Create game logic with selected song ID
    const gameLogic = new GameLogicGameObject(songId);
    this.addChild(gameLogic);
  }
}
