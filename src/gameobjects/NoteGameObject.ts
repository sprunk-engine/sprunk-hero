import {GameObject, MeshRenderBehavior, ObjLoader, RenderGameEngineComponent} from "sprunk-engine";
import BasicVertexMVPWithUV from "../shaders/BasicVertexMVPWithUVAndNormals.vert.wgsl?raw";
import BasicTextureSample from "../shaders/BasicTextureSample-OpenGL-Like.frag.wgsl?raw";
import {Note} from "../models/Note.ts";
import {Fret} from "../models/Fret.ts";

/**
 * A GameObject that represents one note.
 */
export class NoteGameObject extends GameObject{
    public associatedNote : Note;
    public wasProcessed : boolean = false;

    constructor(renderEngine: RenderGameEngineComponent, note : Note) {
        super("Note");
        const fret = Fret.fromIndex(note.fret);
        this.associatedNote = note;

        this.transform.scale.set(0.45, 0.45, 0.45);
        this.transform.position.x = fret.position;

        ObjLoader.load("/assets/note/note.obj").then((obj) => {
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
    }
}