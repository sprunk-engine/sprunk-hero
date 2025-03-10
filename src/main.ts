import {
    Camera, Color,
    GameEngineWindow,
    GameObject, InputGameEngineComponent,
    RenderGameEngineComponent,
    Sprunk, Vector3
} from "sprunk-engine";

import {FreeLookCameraController} from "./debug/FreeLookCameraController.ts";
import {FreeLookCameraKeyboardMouseInput} from "./debug/FreeLookCameraKeyboardMouseInput.ts";
import {GridRenderBehavior} from "./debug/GridRenderBehavior.ts";
import {RoadGameObject} from "./gameobjects/RoadGameObject.ts";
import {GizmoGameObject} from "./gameobjects/GizmoGameObject.ts";
import {GridGameObject} from "./gameobjects/GridGameObject.ts";

const canvas: HTMLCanvasElement =
    document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, true, [
    "InputGameEngineComponent",
    "RenderGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
    gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;
const inputComponent: InputGameEngineComponent =
    gameEngineWindow.getEngineComponent(InputGameEngineComponent)!;

const cameraGo = new GameObject("Camera");
cameraGo.addBehavior(new FreeLookCameraController());
//cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput(inputComponent));
cameraGo.addBehavior(new Camera(renderComponent, Math.PI / 3, undefined, undefined, 100));
cameraGo.transform.position.set(0, 2.5, 3);
cameraGo.transform.rotation.rotateAroundAxis(Vector3.right(),-Math.PI / 8)
gameEngineWindow.root.addChild(cameraGo);

const grid = new GridGameObject(renderComponent);
gameEngineWindow.root.addChild(grid);

const road = new RoadGameObject(renderComponent);
gameEngineWindow.root.addChild(road);

const gizmo = new GizmoGameObject(renderComponent);
gameEngineWindow.root.addChild(gizmo);

