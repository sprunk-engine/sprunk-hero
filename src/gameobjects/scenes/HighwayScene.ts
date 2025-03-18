import {
  Camera,
  GameObject,
  Vector2,
  Vector3,
} from "sprunk-engine";
import { FreeLookCameraController } from "../../debug/FreeLookCameraController.ts";
import { FreeLookCameraKeyboardMouseInput } from "../../debug/FreeLookCameraKeyboardMouseInput.ts";
import { GridGameObject } from "../GridGameObject.ts";
import { GizmoGameObject } from "../GizmoGameObject.ts";
import { GameLogicGameObject } from "../GameLogicGameObject.ts";
import { ButtonGameObject } from "../ButtonGameObject.ts";

/**
 * A scene that represents the highway scene.
 */
export class HighwayScene extends GameObject {
  private _debug: boolean;
  private _playButton!: ButtonGameObject;

  constructor(debug: boolean) {
    super("HighwayScene");
    this._debug = debug;
  }

  protected onEnable() {
    super.onEnable();

    const cameraGo = new GameObject("Camera");
    this.addChild(cameraGo);
    const camera = new Camera(
        Math.PI / 3,
        undefined,
        undefined,
        30
    );
    cameraGo.addBehavior(camera);
    cameraGo.transform.position.set(0, 2, 3);
    cameraGo.transform.rotation.rotateAroundAxis(
        Vector3.right(),
        -Math.PI / 10
    );

    this._playButton = new ButtonGameObject(
        "/assets/play.png",
        new Vector2(0.9, 0.4)
    );
    cameraGo.addChild(this._playButton);
    this._playButton.transform.position.set(0, 0, -2);
    this._playButton.onClicked.addObserver(this.loadGame.bind(this));

    if (this._debug) {
      const grid = new GridGameObject();
      this.addChild(grid);

      const gizmo = new GizmoGameObject();
      this.addChild(gizmo);
      gizmo.transform.position.set(5, 0, 0);

      cameraGo.addBehavior(new FreeLookCameraController());
      cameraGo.addBehavior(
          new FreeLookCameraKeyboardMouseInput()
      );
    }
  }

  public loadGame() {
    const gameLogic = new GameLogicGameObject();
    this.addChild(gameLogic);
    this._playButton.destroy();
  }
}
