import {
    Camera,
    GameObject,
    InputGameEngineComponent,
    Renderer,
    SpriteRenderBehavior, Vector2
} from "sprunk-engine";
import {ButtonLogicBehavior} from "../behaviors/ui/ButtonLogicBehavior.ts";
import {ButtonInputBehavior} from "../behaviors/ui/ButtonInputBehavior.ts";

export class ButtonGameObject extends GameObject{
    /**
     * Creates a new ButtonGameObject.
     * @param camera
     * @param inputEngineComponent
     * @param renderEngine
     * @param spriteImageUrl
     * @param perceivedSize - The perceived size of the button (hit box of image) between 0 and 1 (1 being the size of the corners of image).
     */
    constructor(camera: Camera, inputEngineComponent: InputGameEngineComponent, renderEngine: Renderer, spriteImageUrl: RequestInfo | URL, perceivedSize : Vector2) {
        super("Button");

        this.addBehavior(new SpriteRenderBehavior(renderEngine, spriteImageUrl));
        const logicBehavior = new ButtonLogicBehavior(perceivedSize);
        this.addBehavior(logicBehavior);
        this.addBehavior(new ButtonInputBehavior(camera, inputEngineComponent, logicBehavior));
    }
}