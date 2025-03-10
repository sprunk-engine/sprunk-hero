import {GameObject, MeshRenderBehavior, ObjLoader, RenderGameEngineComponent} from "sprunk-engine";
import BasicVertexMVPWithUV from "../shaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "../shaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import {NoteTextureColor} from "../models/NoteTextureColor.ts";

export class NoteGameObject extends GameObject{
    constructor(renderEngine: RenderGameEngineComponent, color: NoteTextureColor) {
        super("Note" + color);

        this.transform.scale.set(0.45, 0.45, 0.45);

        ObjLoader.load("/assets/note/note.obj").then((obj) => {
            this.addBehavior(
                new MeshRenderBehavior(
                    renderEngine,
                    obj,
                    "/assets/note/" + color,
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