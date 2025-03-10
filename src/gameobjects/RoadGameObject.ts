import {GameObject, MeshRenderBehavior, ObjLoader, RenderGameEngineComponent} from "sprunk-engine";
import BasicVertexMVPWithUV from "../shaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "../shaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";

export class RoadGameObject extends GameObject{
    /**
     * Create the road GameObject
     */
    constructor(renderEngine: RenderGameEngineComponent) {
        super("Road");
        this.transform.position.set(0, 0, -35)

        ObjLoader.load("/assets/road/road-sprunk-hero.obj").then((obj) => {
            this.addBehavior(
                new MeshRenderBehavior(
                    renderEngine,
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
    }
}