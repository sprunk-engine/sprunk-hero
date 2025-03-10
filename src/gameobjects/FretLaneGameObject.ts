import {GameObject, RenderGameEngineComponent} from "sprunk-engine";
import {FretGameObject} from "./FretGameObject.ts";
import {Fret} from "../models/NoteTextureColor.ts";

export class FretLaneGameObject extends GameObject{
    constructor(renderEngine: RenderGameEngineComponent) {
        super("FretLane");

        Fret.all().forEach((fret) => {
            const fretGameObject = new FretGameObject(renderEngine, fret);
            fretGameObject.transform.position.x = fret.position;
            this.addChild(fretGameObject);
        });
    }
}