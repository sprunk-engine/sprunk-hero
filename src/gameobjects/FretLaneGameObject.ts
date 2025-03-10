import {GameObject, InputGameEngineComponent, RenderGameEngineComponent} from "sprunk-engine";
import {FretGameObject} from "./FretGameObject.ts";
import {Fret} from "../models/NoteTextureColor.ts";

export class FretLaneGameObject extends GameObject{
    constructor(renderEngine: RenderGameEngineComponent, input : InputGameEngineComponent) {
        super("FretLane");

        Fret.all().forEach((fret) => {
            const fretGameObject = new FretGameObject(renderEngine, input, fret);
            fretGameObject.transform.position.x = fret.position;
            this.addChild(fretGameObject);
        });
    }
}