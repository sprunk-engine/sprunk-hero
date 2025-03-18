import {Color, GameObject} from "sprunk-engine";
import {GridRenderBehavior} from "../debug/GridRenderBehavior.ts";

/**
 * A GameObject that represents the grid.
 */
export class GridGameObject extends GameObject{
    /**
     * Create the road GameObject
     */
    constructor() {
        super("Grid");
    }

    protected onEnable() {
        super.onEnable();

        this.addBehavior(
            new GridRenderBehavior(200, 1, new Color(0.3, 0.3, 0.3)),
        );
        this.transform.rotation.setFromEulerAngles(Math.PI / 2, 0, 0);
    }
}