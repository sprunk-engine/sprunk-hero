import {Color, GameObject, TextRenderBehavior, Vector3} from "sprunk-engine";
import {ScoreLogicBehavior} from "../behaviors/notes/ScoreLogicBehavior.ts";

/**
 * A GameObject that displays the score, multiplier, and streak of the player.
 */
export class ScoreTextsGameObject extends GameObject{
    private _scoreLogicWatching: ScoreLogicBehavior;

    constructor(scoreLogicWatching : ScoreLogicBehavior) {
        super("Score UI");
        this._scoreLogicWatching = scoreLogicWatching;
    }

    protected onEnable() {
        super.onEnable();

        const colors: [number, number, number, number][] = [[1,1,1,1], [1,1,0,1], [0.2,1,0.2,1], [0.6,0.2,1,1]]

        const score = this.createSubTextObject(1/64, new Color(1,1,1,1));
        const scoreText = score.getFirstBehavior(TextRenderBehavior)!;
        score.transform.position.set(0, 2.9, -5);
        score.transform.rotation.rotateAroundAxis(Vector3.right(), -Math.PI / 8);

        const multiplier = this.createSubTextObject(1/32, new Color(1,1,1,1));
        const multiplierText = multiplier.getFirstBehavior(TextRenderBehavior)!;
        multiplier.transform.position.set(4.4, 0, -5);
        multiplier.transform.rotation.rotateAroundAxis(Vector3.right(), -Math.PI / 3);

        const multiplierBackdrop = this.createSubTextObject(1/27, new Color(0,0,0,1));
        const multiplierBackdropText = multiplierBackdrop.getFirstBehavior(TextRenderBehavior)!;
        multiplierBackdrop.transform.position.set(4.4, -0.01, -5);
        multiplierBackdrop.transform.rotation.rotateAroundAxis(Vector3.right(), -Math.PI / 3);

        const streak = this.createSubTextObject(1/128, new Color(1,1,1,1));
        const streakText = streak.getFirstBehavior(TextRenderBehavior)!;
        streak.transform.position.set(0, 2.4, -5);
        streak.transform.rotation.rotateAroundAxis(Vector3.right(), -Math.PI / 8);

        scoreText.text = "Score: 0";
        multiplierText.text = "x 1";
        multiplierBackdropText.text = "x 1";
        streakText.text = "Streak: 0";
        this._scoreLogicWatching.onDataChanged.addObserver((data) => {
            scoreText.text = `Score: ${data.score}`;
            multiplierText.text = `x ${data.multiplier}`;
            multiplierText.color = colors[data.multiplier - 1];
            multiplierBackdropText.text = `x ${data.multiplier}`;
            streakText.text = `Streak: ${data.streak}`;
        });
    }

    protected onDisable() {
        super.onDisable();
        this._scoreLogicWatching.onDataChanged.removeObservers();
    }

    private createSubTextObject(size : number, color : Color) {
        const subTextObject = new GameObject("SubText");
        this.addChild(subTextObject);
        const textRender = new TextRenderBehavior("assets/fonts/Sprunthrax/Sprunthrax-SemiBold-msdf.json", { centered: true, pixelScale: size, color: [color.r, color.g, color.b, color.a] });
        textRender.text = "...";
        subTextObject.addBehavior(textRender);
        return subTextObject;
    }
}