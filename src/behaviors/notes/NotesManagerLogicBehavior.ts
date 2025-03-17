import {ArrayUtility, GameObject, LogicBehavior, RenderGameEngineComponent, Event} from "sprunk-engine";
import {Mode} from "../../models/Mode.ts";
import {FretLogicBehavior} from "./FretLogicBehavior.ts";
import {Fret} from "../../models/Fret.ts";
import {NoteGameObject} from "../../gameobjects/NoteGameObject.ts";

/**
 * The main logic behavior that controls the note flow.
 */
export class NotesManagerLogicBehavior extends LogicBehavior<void>{
    public static readonly MISSED_NOTE_RANGE = 0.2;

    public onHitNote : Event<{note : NoteGameObject, precision : number}> = new Event();
    public onHitNothing : Event<Fret> = new Event();
    public onMissNote : Event<NoteGameObject> = new Event();

    private _fretLogicBehaviors : FretLogicBehavior[] = [];
    private _container : GameObject | null = null;
    private _renderEngine : RenderGameEngineComponent;
    private _speed : number = 10;
    private _time : number = 0;
    private _sortedNotes : NoteGameObject[] = [];

    constructor(renderEngine : RenderGameEngineComponent, fretLogicBehaviors: FretLogicBehavior[]) {
        super();
        this._fretLogicBehaviors = fretLogicBehaviors;
        this._renderEngine = renderEngine;
    }

    protected onEnable() {
        super.onEnable();
        this.gameObject.getFirstBehavior(LogicBehavior<number>)!.onDataChanged.addObserver(this.updateTime.bind(this));
        this._fretLogicBehaviors.forEach((fretLogic) => {
            fretLogic.onDataChanged.addObserver((pressed) => {
                this.detectNotePress(fretLogic.fret.index, pressed);
            });
        });
    }

    public setChart(modeToPlay : Mode) {
        if(this._container){
            this.gameObject.removeChild(this._container);
        }
        this._container = new GameObject("NotesTrack");
        this.gameObject.addChild(this._container);
        this._generateNotes(modeToPlay);
    }

    private async _generateNotes(mode: Mode)  {
        const maxSupportedIndex = Fret.all().length - 1;
        mode.notes.forEach((note) => {
            if(note.fret > maxSupportedIndex) return;
            const noteGameObject = new NoteGameObject(this._renderEngine, note);
            noteGameObject.transform.position.z = -note.time * this._speed;
            this._container!.addChild(noteGameObject);
            this._sortedNotes.push(noteGameObject);
        });
        // Sort notes by time, ascending
        this._sortedNotes.sort((a, b) => a.associatedNote.time - b.associatedNote.time);
    }

    public updateTime(songTime: number) {
        this._time = songTime;
        if(this._container) {
            this._container.transform.position.z = songTime * this._speed;
        }
        const notesToEnable = this.getNotesAroundTime(songTime+3, 1);
        notesToEnable.forEach((note) => note.enableRendering());
        const notesToDisable = this.getNotesAroundTime(songTime-2, 1);
        notesToDisable.forEach((note) => note.disableRendering());
        this.getMissedNotes(NotesManagerLogicBehavior.MISSED_NOTE_RANGE).forEach((note) => this.missNote(note));
    }

    private getNotesAroundTime(middleTime: number, range: number) {
        const startTarget = {associatedNote: {time: middleTime - range}};
        const startIndex = ArrayUtility.binarySearch(this._sortedNotes, startTarget, (a, b) => a.associatedNote.time - b.associatedNote.time);

        const endTarget = {associatedNote: {time: middleTime + range + 0.01}};
        const endIndex = ArrayUtility.binarySearch(this._sortedNotes, endTarget, (a, b) => a.associatedNote.time - b.associatedNote.time);

        return this._sortedNotes.slice(startIndex, endIndex);
    }

    private getMissedNotes(range: number) {
        return this._sortedNotes.filter((note) => note.associatedNote.time < this._time - range && !note.wasProcessed);
    }

    private detectNotePress(fretIndex: number, pressed: boolean) {
        if(!pressed) return;
        const notesAroundTime = this.getNotesAroundTime(this._time, NotesManagerLogicBehavior.MISSED_NOTE_RANGE);
        const notesInFretAroundTime = notesAroundTime.filter((note) => note.associatedNote.fret === fretIndex);
        const nearestNoteAbolute = notesInFretAroundTime.reduce((nearest, note) => {
            return Math.abs(nearest.associatedNote.time - this._time) < Math.abs(note.associatedNote.time - this._time) ? nearest : note;
        }, notesInFretAroundTime[0]);
        if(!nearestNoteAbolute){
            this.hitNothing(Fret.fromIndex(fretIndex));
            return;
        }
        const spaceInTime = Math.abs(nearestNoteAbolute.associatedNote.time - this._time);
        if(spaceInTime < NotesManagerLogicBehavior.MISSED_NOTE_RANGE) {
            this.bustNote(nearestNoteAbolute, spaceInTime);
        }
    }

    private bustNote(note: NoteGameObject, pressPrecision: number) {
        this._container!.removeChild(note);
        note.wasProcessed = true;
        this.onHitNote.emit({note, precision: pressPrecision});
    }

    private missNote(note: NoteGameObject) {
        note.wasProcessed = true;
        this.onMissNote.emit(note);
    }

    private hitNothing(fret: Fret) {
        this.onHitNothing.emit(fret);
    }
}