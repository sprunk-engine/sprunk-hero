import {Color, GameObject, RenderGameEngineComponent} from "sprunk-engine";
import {GridRenderBehavior} from "../debug/GridRenderBehavior.ts";

export class GridGameObject extends GameObject{
    /**
     * Create the road GameObject
     */
    constructor(renderEngine: RenderGameEngineComponent) {
        super("Grid");

        this.addBehavior(
            new GridRenderBehavior(renderEngine, 200, 1, new Color(0.3, 0.3, 0.3)),
        );
        this.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);
    }
}