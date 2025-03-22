import {DeviceInputBehavior, Inject} from "sprunk-engine";
import {FretLogicBehavior} from "./FretLogicBehavior.ts";

/**
 * A logic behavior that controls a fret input with keyboard input.
 */
export class FretInputBehavior extends DeviceInputBehavior{
    @Inject(FretLogicBehavior)
    private _logic!: FretLogicBehavior;

    constructor() {
        super();
    }

    onKeyboardKeyDown(_key: string) {
        super.onKeyboardKeyDown(_key);
        if(_key === this._logic.fret.keyboardKey){
            this.onPressed();
        }
    }

    onKeyboardKeyUp(_key: string) {
        super.onKeyboardKeyUp(_key);
        if(_key === this._logic.fret.keyboardKey){
            this.onReleased();
        }
    }

    protected onPressed(){
        this._logic.onPressed();
    }

    protected onReleased(){
        this._logic.onReleased();
    }
}