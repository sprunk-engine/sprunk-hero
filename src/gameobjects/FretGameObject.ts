import {
    GameObject,
    InputGameEngineComponent,
    MeshRenderBehavior,
    ObjLoader,
    RenderGameEngineComponent
} from "sprunk-engine";
import BasicVertexMVPWithUV from "../shaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "../shaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import {Fret} from "../models/NoteTextureColor.ts";
import {FretLogicBehavior} from "../behaviors/notes/FretLogicBehavior.ts";
import {FretOutputbehavior} from "../behaviors/notes/FretOutputbehavior.ts";
import {FretInputBehavior} from "../behaviors/notes/FretInputBehavior.ts";

export class FretGameObject extends GameObject{
    constructor(renderEngine: RenderGameEngineComponent, input : InputGameEngineComponent, fret: Fret) {
        super("Fret " + fret.toString());

        ObjLoader.load("/assets/note/fret.obj").then((obj) => {
            this.addBehavior(
                new MeshRenderBehavior(
                    renderEngine,
                    obj,
                    fret.texturePath,
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

        const fretLogic = new FretLogicBehavior(fret);
        this.addBehavior(fretLogic);
        this.addBehavior(new FretOutputbehavior(0.35, 0.55, 0.03));
        this.addBehavior(new FretInputBehavior(input, fretLogic));
    }
}