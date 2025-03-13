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
            score: this.data.score + this.computeScore(precision) * this.data.multiplier,
            streak: this.data.streak + 1,
            multiplier: Math.min(1 + Math.floor(this.data.streak / 5), 5),
        };
        this.notifyDataChanged();
    }

    public hitNothing(_fret : Fret) {
        this.resetStreak();
    }

    public missNote(_note : NoteGameObject) {
        this.resetStreak();
    }

    private resetStreak() {
        this.data = {
            ...this.data,
            streak: defaultScore.streak,
            multiplier: defaultScore.multiplier,
        };
        this.notifyDataChanged();
    }

    private computeScore(precision : number) {
        if(precision < 0.05) return 100;
        if(precision < 0.1) return 50;
        return 25;
    }
}