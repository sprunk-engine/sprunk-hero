import {
    Camera,
    GameEngineWindow,
    GameObject,
    InputGameEngineComponent,
    RenderGameEngineComponent, SpriteRenderBehavior, Vector2,
    Vector3
} from "sprunk-engine";
import {FreeLookCameraController} from "../../debug/FreeLookCameraController.ts";
import {FreeLookCameraKeyboardMouseInput} from "../../debug/FreeLookCameraKeyboardMouseInput.ts";
import {GridGameObject} from "../GridGameObject.ts";
import {GizmoGameObject} from "../GizmoGameObject.ts";
import {GameLogicGameObject} from "../GameLogicGameObject.ts";
import {ButtonGameObject} from "../ButtonGameObject.ts";

/**
 * A scene that represents the highway scene.
 */
export class HighwayScene extends GameObject{
    private _renderComponent: RenderGameEngineComponent;
    private _inputComponent: InputGameEngineComponent;
    private _playButton: ButtonGameObject;

    constructor(gameEngineWindow: GameEngineWindow, debug: boolean) {
        super("HighwayScene");

        this._renderComponent  =
            gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;
        this._inputComponent =
        gameEngineWindow.getEngineComponent(InputGameEngineComponent)!;

        const cameraGo = new GameObject("Camera");
        const camera = new Camera(this._renderComponent, Math.PI / 3, undefined, undefined, 30);
        cameraGo.addBehavior(camera);
        cameraGo.transform.position.set(0, 2, 3);
        cameraGo.transform.rotation.rotateAroundAxis(Vector3.right(),-Math.PI / 10)
        this.addChild(cameraGo);

        this._playButton = new ButtonGameObject(camera, this._inputComponent, this._renderComponent, "/assets/play.png", new Vector2(0.9, 0.4));
        this._playButton.transform.position.set(0, 0, -2);
        this._playButton.onClicked.addObserver(this.loadGame.bind(this));
        cameraGo.addChild(this._playButton);

        if(debug) {
            const grid = new GridGameObject(this._renderComponent);
            this.addChild(grid);

            const gizmo = new GizmoGameObject(this._renderComponent);
            this.addChild(gizmo);
            gizmo.transform.position.set(5, 0, 0);

            cameraGo.addBehavior(new FreeLookCameraController());
            cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput(this._inputComponent));
        }
    }

    public loadGame(){
        const gameLogic = new GameLogicGameObject(this._renderComponent, this._inputComponent);
        this.addChild(gameLogic);
        this._playButton.destroy();
    }
}