import {LogicBehavior} from "sprunk-engine";
import {Fret} from "../../models/NoteTextureColor.ts";
//import {BooleanStateObservable} from "../../models/BooleanState.ts";

export class FretLogicBehavior extends LogicBehavior<boolean>/* implements BooleanStateObservable*/{
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