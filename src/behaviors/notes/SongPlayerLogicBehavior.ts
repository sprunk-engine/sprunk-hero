import {LogicBehavior} from "sprunk-engine";

/**
 * A simple logic behavior that controls a song player based on it's audio input.
 */
export class SongPlayerLogicBehavior extends LogicBehavior<number>{
    private _time : number = 0;
    //TODO : Implement audio playback + notify NotesManagerLogicBehavior
    tick(_deltaTime: number) {
        this._time += _deltaTime;
        this.data = this._time;
        this.notifyDataChanged();
        super.tick(_deltaTime);
    }
}