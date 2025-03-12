import {LogicBehavior} from "sprunk-engine";
import {defaultScore, Score} from "../../models/Score.ts";
import {NoteGameObject} from "../../gameobjects/NoteGameObject.ts";
import {Fret} from "../../models/Fret.ts";

export class ScoreLogicBehavior extends LogicBehavior<Score>{
    protected onEnable() {
        super.onEnable();
        this.data = defaultScore;
    }

    public hitNote(_note : NoteGameObject, precision : number) {
        this.data = {
            ...this.data,
            score: this.data.score + this.computeScore(precision)
        };
        this.notifyDataChanged();
    }

    public hitNothing(_fret : Fret) {
        this.data = {
            ...this.data,
            score: this.data.score - 50
        };
        this.notifyDataChanged();
    }

    public missNote(_note : NoteGameObject) {
        this.data = {
            ...this.data,
            score: this.data.score - 100
        };
        this.notifyDataChanged();
    }

    private computeScore(precision : number) {
        if(precision < 0.05) return 100;
        if(precision < 0.1) return 50;
        return 25;
    }
}