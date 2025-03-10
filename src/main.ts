import {
    Camera,
    GameEngineWindow,
    GameObject,
    RenderGameEngineComponent,
    SpriteRenderBehavior,
    Sprunk
} from "sprunk-engine";

const canvas: HTMLCanvasElement =
    document.querySelector<HTMLCanvasElement>("#app")!;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, true, [
    "InputGameEngineComponent",
    "RenderGameEngineComponent",
]);
const renderComponent: RenderGameEngineComponent =
    gameEngineWindow.getEngineComponent(RenderGameEngineComponent)!;

const go = new GameObject("Sprite");
gameEngineWindow.root.addChild(go);

go.addBehavior(
    new SpriteRenderBehavior(renderComponent, "/sprunk.png"),
);

const cameraGo = new GameObject("Camera");
cameraGo.addBehavior(new Camera(renderComponent, Math.PI / 2));
cameraGo.transform.position.z = 10;
gameEngineWindow.root.addChild(cameraGo);