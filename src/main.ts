import {
    Camera,
    GameEngineWindow,
    GameObject,
    InputGameEngineComponent,
    RenderGameEngineComponent,
    SpriteRenderBehavior,
    Sprunk,
    Vector3
} from "sprunk-engine";

import {FreeLookCameraController} from "./debug/FreeLookCameraController.ts";
import {FreeLookCameraKeyboardMouseInput} from "./debug/FreeLookCameraKeyboardMouseInput.ts";
import {RoadGameObject} from "./gameobjects/RoadGameObject.ts";
import {GizmoGameObject} from "./gameobjects/GizmoGameObject.ts";
import {GridGameObject} from "./gameobjects/GridGameObject.ts";
import {FretGameObject} from "./gameobjects/FretGameObject.ts";
import {NoteTextureColor} from "./models/NoteTextureColor.ts";
import {FretLaneGameObject} from "./gameobjects/FretLaneGameObject.ts";

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
cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput(inputComponent));
cameraGo.addBehavior(new Camera(renderComponent, Math.PI / 3, undefined, undefined, 30));
cameraGo.transform.position.set(0, 2.5, 3);
cameraGo.transform.rotation.rotateAroundAxis(Vector3.right(),-Math.PI / 8)
gameEngineWindow.root.addChild(cameraGo);

const background = new GameObject("Background");
background.transform.position.set(0, 0, -29.99);
const size = 40;
background.transform.scale.x = size*16/9;
background.transform.scale.y = size;
background.addBehavior(new SpriteRenderBehavior(renderComponent, "/assets/background.jpg"))
cameraGo.addChild(background);

const grid = new GridGameObject(renderComponent);
gameEngineWindow.root.addChild(grid);

const road = new RoadGameObject(renderComponent);
gameEngineWindow.root.addChild(road);

const gizmo = new GizmoGameObject(renderComponent);
gameEngineWindow.root.addChild(gizmo);
gizmo.transform.position.set(5, 0, 0);

const fretsLane = new FretLaneGameObject(renderComponent);
gameEngineWindow.root.addChild(fretsLane);