import {GameObject, MeshRenderBehavior, ObjLoader} from "sprunk-engine";
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

    private _meshRenderBehavior : MeshRenderBehavior | undefined;
    private _needRendering : boolean = false;
    private _isRendered : boolean = false;

    constructor(note : Note) {
        super("Note");
        this.associatedNote = note;
    }

    protected onEnable() {
        super.onEnable();
        const fret = Fret.fromIndex(this.associatedNote.fret);

        this.transform.scale.set(0.45, 0.45, 0.45);
        this.transform.position.x = fret.position;

        ObjLoader.load("/assets/note/note.obj").then((obj) => {
            this._meshRenderBehavior = new MeshRenderBehavior(
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
            );
            if(this._needRendering){
                this.enableRendering();
            }
        });
    }

    public enableRendering() {
        if(this._isRendered) return;
        this._needRendering = true;
        if(this._meshRenderBehavior){
            this.addBehavior(this._meshRenderBehavior);
            this._isRendered = true;
        }
    }

    public disableRendering() {
        if(!this._isRendered) return;
        this._needRendering = false;
        if(this._meshRenderBehavior) {
            console.log(this._meshRenderBehavior + " " + this._isRendered + " " + this._needRendering + " " + this.name);
            this.removeBehavior(this._meshRenderBehavior);
            this._isRendered = false;
        }
    }
}