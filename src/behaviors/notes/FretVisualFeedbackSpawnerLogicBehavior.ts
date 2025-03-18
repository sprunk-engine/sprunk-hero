import {Color, GameObject, LogicBehavior, Vector3} from "sprunk-engine";
import {VisualFeedbackOutputBehavior} from "../transform/VisualFeedbackOutputBehavior.ts";
import {Fret} from "../../models/Fret.ts";
import {NoteGameObject} from "../../gameobjects/NoteGameObject.ts";

/**
 * A behavior that contains logic to spawn visual feedback for the player when they hit a note.
 */
export class FretVisualFeedbackSpawnerLogicBehavior extends LogicBehavior<void>{
    private readonly _perfectNoteColor : Color = new Color(0,1,0,1);
    private readonly _veryGoodNoteColor : Color = new Color(0.3,1,0,1);
    private readonly _goodNoteColor : Color = new Color(0.6,1,0,1);
    private readonly _missNoteColor : Color = new Color(1,0,0,1);
    private readonly _hitNothingColor : Color = new Color(1,0.5,0,1);

    public showHitNote(_note : NoteGameObject, precision : number) {
        this.spawn(Fret.fromIndex(_note.associatedNote.fret), this.getScoreText(precision), this.getHitColor(precision));
    }

    public showHitNothing(_fret : Fret) {
        this.spawn(_fret, "Bad hit!", this._hitNothingColor);
    }

    public showMissNote(_note : NoteGameObject) {
        this.spawn(Fret.fromIndex(_note.associatedNote.fret), "Missed!", this._missNoteColor);
    }

    private spawn(fret: Fret, text : string, color : Color){
        const gameObject = new GameObject("FretVisualFeedback");
        this.gameObject.addChild(gameObject);
        const from = new Vector3(fret.position,0.5,0);
        const to = new Vector3(fret.position,1,0.1);
        const feedbackBehavior = new VisualFeedbackOutputBehavior(color, text, from, to, 0.6);
        gameObject.addBehavior(feedbackBehavior);
        feedbackBehavior.onAnimationEnd.addObserver(() => {
            gameObject.destroy();
        });
    }
    private getScoreText(precision : number) {
        if(precision < 0.05) return "Perfect!";
        if(precision < 0.1) return "Very Good!";
        return "Good!";
    }

    private getHitColor(precision : number) {
        if(precision < 0.05) return this._perfectNoteColor;
        if(precision < 0.1) return this._veryGoodNoteColor;
        return this._goodNoteColor;
    }
}