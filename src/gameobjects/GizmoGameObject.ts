import {GameObject, MeshRenderBehavior, ObjLoader, RenderGameEngineComponent} from "sprunk-engine";
import BasicVertexMVPWithUV from "../shaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "../shaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";

/**
 * A GameObject that represents the gizmo.
 */
export class GizmoGameObject extends GameObject{
    /**
     * Create the road GameObject
     */
    constructor(renderEngine: RenderGameEngineComponent) {
        super("Gizmo");

        ObjLoader.load("/assets/gizmo/gizmo.obj").then((obj) => {
            this.addBehavior(
                new MeshRenderBehavior(
                    renderEngine,
                    obj,
                    "/assets/gizmo/gizmo.png",
                    BasicVertexMVPWithUV,
                    BasicTextureSample,
                ),
            )
        });
    }
}