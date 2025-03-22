import {LogicBehavior} from "sprunk-engine";
import {Fret} from "../../models/Fret.ts";

/**
 * A simple logic behavior that controls a fret input.
 */
export class FretLogicBehavior extends LogicBehavior<boolean>{
    private readonly _fret : Fret;

    public get fret() : Fret {
        return this._fret;
    }

    constructor(fret : Fret) {
        super();
        this._fret = fret;
    }

    public onPressed() {
        this.data = true;
        this.notifyDataChanged();
    }

    public onReleased() {
        this.data = false;
        this.notifyDataChanged();
    }
}