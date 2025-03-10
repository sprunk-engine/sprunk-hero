import {LogicBehavior} from "sprunk-engine";
import {Chart} from "../../models/Chart.ts";
import {Mode} from "../../models/Mode.ts";
import {FretLogicBehavior} from "./FretLogicBehavior.ts";

export class NotesManagerLogicBehavior extends LogicBehavior<void>{
    private _chart : Chart;
    private _modeToPlay : Mode;
    private _fretLogicBehaviors : FretLogicBehavior[];

    constructor(fretLogicBehaviors: FretLogicBehavior[]) {
        super();
        this._fretLogicBehaviors = fretLogicBehaviors;
    }

    public setChart(chart: Chart, modeToPlay : Mode) {
        this._chart = chart;
        this._modeToPlay = modeToPlay;
    }

    public updateTime(songTime: number) {
        //TODO : Implement this
    }

    tick(_deltaTime: number) {
        super.tick(_deltaTime);
        //TODO : Implement note verification
    }
}