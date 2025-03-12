import {LogicBehavior, RenderGameEngineComponent, TextRenderBehavior} from "sprunk-engine";
import {Score} from "../../models/Score.ts";

export class ScoreDisplayOutputbehavior extends TextRenderBehavior{
    constructor(renderEngine: RenderGameEngineComponent) {
        super(renderEngine, "assets/fonts/Sprunthrax/Sprunthrax-SemiBold-msdf.json", { centered: true, pixelScale: 1/64 });
        this._renderEngine = renderEngine;
        this.text = "Score: 0";
    }

    protected onEnable() {
        super.onEnable();
        this.observe(LogicBehavior<Score>, (score : Score) => {
            this.text = "Score: " + score.score;
        });
    }
}