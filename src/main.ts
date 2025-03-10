import {
    Camera, Color,
    GameEngineWindow,
    GameObject, InputGameEngineComponent, MeshRenderBehavior, ObjLoader,
    RenderGameEngineComponent,
    SpriteRenderBehavior,
    Sprunk
} from "sprunk-engine";

import {FreeLookCameraController} from "./debug/FreeLookCameraController.ts";
import {FreeLookCameraKeyboardMouseInput} from "./debug/FreeLookCameraKeyboardMouseInput.ts";
import {GridRenderBehavior} from "./debug/GridRenderBehavior.ts";
import BasicVertexMVPWithUV from "./shaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "./shaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";

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

const road = new GameObject("Road");
gameEngineWindow.root.addChild(road);

ObjLoader.load("/assets/road/road-sprunk-hero.obj").then((obj) => {
    road.addBehavior(
        new MeshRenderBehavior(
            renderComponent,
            obj,
            "/assets/road/GH3_PC-Axel-Unwrapped.png",
            BasicVertexMVPWithUV,
            BasicTextureSample,
            {
                addressModeU: "repeat",
                addressModeV: "repeat",
                magFilter: "linear",
                minFilter: "linear",
            }
        ),
    )
});
