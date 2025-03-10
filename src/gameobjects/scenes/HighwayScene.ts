import {
    Camera,
    GameEngineWindow,
    GameObject,
    InputGameEngineComponent,
    RenderGameEngineComponent, SpriteRenderBehavior,
    Vector3
} from "sprunk-engine";
import {FreeLookCameraController} from "../../debug/FreeLookCameraController.ts";
import {FreeLookCameraKeyboardMouseInput} from "../../debug/FreeLookCameraKeyboardMouseInput.ts";
import {GridGameObject} from "../GridGameObject.ts";
import {RoadGameObject} from "../RoadGameObject.ts";
import {GizmoGameObject} from "../GizmoGameObject.ts";
import {FretLaneGameObject} from "../FretLaneGameObject.ts";
import {GameLogicGameObject} from "../GameLogicGameObject.ts";

export class HighwayScene extends GameObject{
    constructor(gameEngineWindow: GameEngineWindow, debug: boolean) {
        super("HighwayScene");

        const renderComponent: RenderGameEngineComponent =
            gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;
        const inputComponent: InputGameEngineComponent =
            gameEngineWindow.getEngineComponent(InputGameEngineComponent)!;

        const cameraGo = new GameObject("Camera");
        cameraGo.addBehavior(new Camera(renderComponent, Math.PI / 3, undefined, undefined, 30));
        cameraGo.transform.position.set(0, 2.5, 3);
        cameraGo.transform.rotation.rotateAroundAxis(Vector3.right(),-Math.PI / 8)
        this.addChild(cameraGo);

        const background = new GameObject("Background");
        background.transform.position.set(0, 0, -29.99);
        const size = 40;
        background.transform.scale.x = size*16/9;
        background.transform.scale.y = size;
        background.addBehavior(new SpriteRenderBehavior(renderComponent, "/assets/background.jpg"))
        cameraGo.addChild(background);

        const gameLogic = new GameLogicGameObject(renderComponent, inputComponent);
        this.addChild(gameLogic);

        if(debug) {
            const grid = new GridGameObject(renderComponent);
            this.addChild(grid);

            const gizmo = new GizmoGameObject(renderComponent);
            this.addChild(gizmo);
            gizmo.transform.position.set(5, 0, 0);

            cameraGo.addBehavior(new FreeLookCameraController());
            cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput(inputComponent));
        }
    }
}