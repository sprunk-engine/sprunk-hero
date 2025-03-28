import {GameObject, MeshRenderBehavior, ObjLoader} from "sprunk-engine";
import BasicVertexMVPWithUV from "../shaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "../shaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import {
    RepeatableForwardOutputBehavior
} from "../behaviors/transform/RepeatableForwardOutputBehavior.ts";

/**
 * A GameObject that represents the moving road.
 */
export class RoadGameObject extends GameObject{
    /**
     * Create the road GameObject
     */
    constructor() {
        super("Road");
    }

    protected onEnable() {
        super.onEnable();

        ObjLoader.load("/assets/road/road-sprunk-hero.obj").then((obj) => {
            this.addBehavior(
                new MeshRenderBehavior(
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

        this.addBehavior(new RepeatableForwardOutputBehavior(10, -35, -26.2));
    }
}