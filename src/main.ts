import {
    Camera, Color,
    GameEngineWindow,
    GameObject, InputGameEngineComponent,
    RenderGameEngineComponent,
    SpriteRenderBehavior,
    Sprunk
} from "sprunk-engine";
import {FreeLookCameraController} from "./debug/FreeLookCameraController.ts";
import {FreeLookCameraKeyboardMouseInput} from "./debug/FreeLookCameraKeyboardMouseInput.ts";
import {GridRenderBehavior} from "./debug/GridRenderBehavior.ts";

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

const go = new GameObject("Sprite");
gameEngineWindow.root.addChild(go);

go.addBehavior(
    new SpriteRenderBehavior(renderComponent, "/sprunk.png"),
);

const cameraGo = new GameObject("Camera");
cameraGo.addBehavior(new FreeLookCameraController());
cameraGo.addBehavior(new FreeLookCameraKeyboardMouseInput(inputComponent));
cameraGo.addBehavior(new Camera(renderComponent, Math.PI / 2));
cameraGo.transform.position.z = 10;
gameEngineWindow.root.addChild(cameraGo);

const grid = new GameObject("Grid");
grid.addBehavior(
    new GridRenderBehavior(renderComponent, 200, 1, new Color(0.3, 0.3, 0.6)),
);
grid.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);

gameEngineWindow.root.addChild(grid);