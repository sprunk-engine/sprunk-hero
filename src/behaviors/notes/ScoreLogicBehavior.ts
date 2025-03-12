import {LogicBehavior} from "../../../../game-engine";
import {defaultScore, Score} from "../../models/Score.ts";
import {NoteGameObject} from "../../gameobjects/NoteGameObject.ts";
import {Fret} from "../../models/Fret.ts";

export class ScoreLogicBehavior extends LogicBehavior<Score>{
    private _score : Score = defaultScore;

    public get score() : Score {
        return this._score;
    }

    protected onEnable() {
        super.onEnable();
    }

    public hitNote(_note : NoteGameObject, precision : number) {
        this._score = {
            ...this._score,
            score: this._score.score + Math.floor(100 * precision)
        };
        this.notifyDataChanged();
    }

    public hitNothing(_fret : Fret) {
        this._score = {
            ...this._score,
            score: this._score.score - 50
        };
        this.notifyDataChanged();
    }

    public missNote(_note : NoteGameObject) {
        this._score = {
            ...this._score,
            score: this._score.score - 100
        };
        this.notifyDataChanged();
    }
}