import {GameObject} from "sprunk-engine";
import {FretGameObject} from "./FretGameObject.ts";
import {Fret} from "../models/Fret.ts";
import {FretLogicBehavior} from "../behaviors/notes/FretLogicBehavior.ts";

/**
 * A GameObject that represents all fret lanes (a ground of frets).
 */
export class FretHandleGameObject extends GameObject{
    public fretLogicBehaviors!: FretLogicBehavior[];

    constructor() {
        super("FretLane");
    }

    protected onEnable() {
        super.onEnable();

        this.fretLogicBehaviors = Fret.all().map((fret) => {
            const fretGameObject = new FretGameObject(fret);
            this.addChild(fretGameObject);
            return fretGameObject.getFirstBehavior(FretLogicBehavior)!;
        });
    }
}