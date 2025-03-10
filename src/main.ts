import {
    GameEngineWindow,
    Sprunk,
} from "sprunk-engine";
import {HighwayScene} from "./gameobjects/scenes/HighwayScene.ts";

const canvas: HTMLCanvasElement =
    document.querySelector<HTMLCanvasElement>("#app")!;

const debug = false;

const gameEngineWindow: GameEngineWindow = Sprunk.newGame(canvas, debug, [
    "InputGameEngineComponent",
    "RenderGameEngineComponent",
]);

const scene = new HighwayScene(gameEngineWindow, debug);
gameEngineWindow.root.addChild(scene);