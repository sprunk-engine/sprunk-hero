import {LogicBehavior} from "sprunk-engine";

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