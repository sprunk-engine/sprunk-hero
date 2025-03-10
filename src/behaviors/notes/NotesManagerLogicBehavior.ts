import {GameObject, LogicBehavior, RenderGameEngineComponent} from "sprunk-engine";
import {Chart} from "../../models/Chart.ts";
import {Mode} from "../../models/Mode.ts";
import {FretLogicBehavior} from "./FretLogicBehavior.ts";
import {Fret} from "../../models/NoteTextureColor.ts";
import {NoteGameObject} from "../../gameobjects/NoteGameObject.ts";

export class NotesManagerLogicBehavior extends LogicBehavior<void>{
    private _chart : Chart | null = null;
    private _modeToPlay : Mode | null = null;
    private _fretLogicBehaviors : FretLogicBehavior[] = [];
    private _container : GameObject | null = null;
    private _renderEngine : RenderGameEngineComponent;
    private _speed : number = 10;

    constructor(renderEngine : RenderGameEngineComponent, fretLogicBehaviors: FretLogicBehavior[]) {
        super();
        this._fretLogicBehaviors = fretLogicBehaviors;
        this._renderEngine = renderEngine;
    }

    protected onEnable() {
        super.onEnable();
        this.gameObject.getFirstBehavior(LogicBehavior<number>)!.onDataChanged.addObserver(this.updateTime.bind(this));
    }

    public setChart(chart: Chart, modeToPlay : Mode) {
        this._chart = chart;
        this._modeToPlay = modeToPlay;
        if(this._container){
            this.gameObject.removeChild(this._container);
        }
        this._container = new GameObject("NotesTrack");
        this.gameObject.addChild(this._container);
        this._generateNotes(modeToPlay);
    }

    private _generateNotes(mode: Mode) {
        mode.notes.forEach((note) => {
            const noteGameObject = new NoteGameObject(this._renderEngine, Fret.fromIndex(note.fret));
            noteGameObject.transform.position.z = -note.time * this._speed;
            this._container!.addChild(noteGameObject);
        });
    }

    public updateTime(songTime: number) {
        if(this._container) {
            this._container.transform.position.z = songTime * this._speed;
        }
    }
}