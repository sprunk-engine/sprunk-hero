import {GameObject, InputGameEngineComponent, RenderGameEngineComponent} from "sprunk-engine";
import {FretGameObject} from "./FretGameObject.ts";
import {Fret} from "../models/NoteTextureColor.ts";
import {FretLogicBehavior} from "../behaviors/notes/FretLogicBehavior.ts";

export class FretLaneGameObject extends GameObject{
    public readonly fretLogicBehaviors: FretLogicBehavior[];

    constructor(renderEngine: RenderGameEngineComponent, input : InputGameEngineComponent) {
        super("FretLane");

        this.fretLogicBehaviors = Fret.all().map((fret) => {
            const fretGameObject = new FretGameObject(renderEngine, input, fret);
            this.addChild(fretGameObject);
            return fretGameObject.fretLogicBehavior;
        });
    }
}