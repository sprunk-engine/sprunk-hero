import {GameObject, RenderGameEngineComponent} from "sprunk-engine";
import {FretGameObject} from "./FretGameObject.ts";
import {NoteTextureColor} from "../models/NoteTextureColor.ts";

export class FretLaneGameObject extends GameObject{
    constructor(renderEngine: RenderGameEngineComponent) {
        super("FretLane");

        const frets = [NoteTextureColor.Green, NoteTextureColor.Red, NoteTextureColor.Yellow, NoteTextureColor.Blue, NoteTextureColor.Orange];

        frets.forEach((fret, index) => {
            const fretGameObject = new FretGameObject(renderEngine, fret);
            fretGameObject.transform.position.x = (index - 2);
            this.addChild(fretGameObject);
        });
    }
}