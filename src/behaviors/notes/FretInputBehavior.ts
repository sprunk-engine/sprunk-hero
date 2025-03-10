import {DeviceInputBehavior, InputGameEngineComponent} from "sprunk-engine";
import {Fret} from "../../models/NoteTextureColor.ts";
import {FretLogicBehavior} from "./FretLogicBehavior.ts";

export class FretInputBehavior extends DeviceInputBehavior{
    private _logic : FretLogicBehavior;

    constructor(inputEngineComponent: InputGameEngineComponent, logic : FretLogicBehavior) {
        super(inputEngineComponent);
        this._logic = logic;
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