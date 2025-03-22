import {
  Camera,
  GameEngineWindow,
  GameObject,
  InputGameEngineComponent,
  RenderGameEngineComponent,
  Vector2,
  Vector3,
} from "sprunk-engine";
import { FreeLookCameraController } from "../../debug/FreeLookCameraController.ts";
import { FreeLookCameraKeyboardMouseInput } from "../../debug/FreeLookCameraKeyboardMouseInput.ts";
import { GridGameObject } from "../GridGameObject.ts";
import { GizmoGameObject } from "../GizmoGameObject.ts";
import { GameLogicGameObject } from "../GameLogicGameObject.ts";
import { ButtonGameObject } from "../ButtonGameObject.ts";
import { SongSelectionGameObject } from "../SongSelectionGameObject.ts";

/**
 * A scene that represents the highway scene.
 */
export class HighwayScene extends GameObject {
  private _renderComponent: RenderGameEngineComponent;
  private _inputComponent: InputGameEngineComponent;
  private _playButton: ButtonGameObject;
  private _songSelection: SongSelectionGameObject;
  private _selectedSongId: string = "";
  private _cameraGo: GameObject;
  private _camera: Camera;

  constructor(gameEngineWindow: GameEngineWindow, debug: boolean) {
    super("HighwayScene");

    this._renderComponent = gameEngineWindow.getEngineComponent(
      RenderGameEngineComponent
    )!;
    this._inputComponent = gameEngineWindow.getEngineComponent(
      InputGameEngineComponent
    )!;

    // Create a static camera for menu
    this._cameraGo = new GameObject("Camera");
    this._camera = new Camera(
      this._renderComponent,
      Math.PI / 3,
      undefined,
      undefined,
      30
    );
    this._cameraGo.addBehavior(this._camera);
    this._cameraGo.transform.position.set(0, 0, 10); // Camera 10 units back
    this.addChild(this._cameraGo);

    // Create song selection UI
    this._songSelection = new SongSelectionGameObject(
      this._camera,
      this._inputComponent,
      this._renderComponent
    );

    // Position song selection in front of camera
    this._songSelection.transform.position.set(0, 0, 0);
    this.addChild(this._songSelection);
    this._songSelection.onSongSelected.addObserver(
      this.onSongSelected.bind(this)
    );

    // Create play button (initially hidden)
    this._playButton = new ButtonGameObject(
      this._camera,
      this._inputComponent,
      this._renderComponent,
      "/assets/play.png",
      new Vector2(0.9, 0.4)
    );
    this._playButton.transform.position.set(0, 0, -2); // Original position
    this._playButton.transform.scale.set(0, 0, 0); // Hide initially
    this._cameraGo.addChild(this._playButton); // Attach to camera as original
    this._playButton.onClicked.addObserver(this.loadGame.bind(this));

    if (debug) {
      const grid = new GridGameObject(this._renderComponent);
      this.addChild(grid);

      const gizmo = new GizmoGameObject(this._renderComponent);
      this.addChild(gizmo);
      gizmo.transform.position.set(5, 0, 0);

      this._cameraGo.addBehavior(new FreeLookCameraController());
      this._cameraGo.addBehavior(
        new FreeLookCameraKeyboardMouseInput(this._inputComponent)
      );
    }
  }

  /**
   * Called when a song is selected from the song selection UI.
   * @param songId The ID of the selected song.
   */
  private onSongSelected(songId: string) {
    this._selectedSongId = songId;

    // Hide song selection and show play button
    this._songSelection.cleanup();

    // Show play button with original animation
    this._playButton.transform.scale.set(1, 1, 1); // Original scale
  }

  public loadGame() {
    if (!this._selectedSongId) {
      console.error("No song selected");
      return;
    }

    // Hide play button
    this._playButton.destroy();

    // Reset camera for gameplay
    this._cameraGo.transform.position.set(0, 2, 3);
    this._cameraGo.transform.rotation.rotateAroundAxis(
      Vector3.right(),
      -Math.PI / 10
    );

    // Create game logic with selected song ID
    const gameLogic = new GameLogicGameObject(
      this._renderComponent,
      this._inputComponent,
      this._selectedSongId
    );
    this.addChild(gameLogic);
  }
}
