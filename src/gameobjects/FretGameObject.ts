import {
    GameObject,
    InputGameEngineComponent,
    MeshRenderBehavior,
    ObjLoader,
    RenderGameEngineComponent
} from "sprunk-engine";
import BasicVertexMVPWithUV from "../shaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "../shaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import {Fret} from "../models/Fret.ts";
import {FretLogicBehavior} from "../behaviors/notes/FretLogicBehavior.ts";
import {FretInputBehavior} from "../behaviors/notes/FretInputBehavior.ts";
import {BooleanScaleOutputBehavior} from "../behaviors/transform/BooleanScaleOutputBehavior.ts";

/**
 * A GameObject that represents a fret.
 */
export class FretGameObject extends GameObject{
    public readonly fretLogicBehavior: FretLogicBehavior;

    constructor(renderEngine: RenderGameEngineComponent, input : InputGameEngineComponent, fret: Fret) {
        super("Fret " + fret.toString());

        this.transform.position.x = fret.position;

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

        this.fretLogicBehavior = new FretLogicBehavior(fret);
        this.addBehavior(this.fretLogicBehavior);
        this.addBehavior(new BooleanScaleOutputBehavior(0.35, 0.55, 0.03));
        this.addBehavior(new FretInputBehavior(input, this.fretLogicBehavior));
    }
}