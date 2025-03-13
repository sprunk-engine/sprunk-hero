import {Color, Event, RenderGameEngineComponent, TextRenderBehavior, Vector3} from "sprunk-engine";

/**
 * A text render behavior that displays visual feedback to the user.
 */
export class VisualFeedbackOutputBehavior extends TextRenderBehavior{
    private _from : Vector3;
    private _to : Vector3;
    private _totalTime : number;
    /**
     * Should go from 0 to (Math.PI / 2) in X amount of time defined in the constructor
     * @private
     */
    private _totalTimeMultiplier : number;
    private _time : number = 0;

    public onAnimationEnd : Event<void> = new Event<void>();

    constructor(renderEngine: RenderGameEngineComponent, color: Color, text: string, from : Vector3, to : Vector3, totalTime : number) {
        super(renderEngine, "assets/fonts/Sprunthrax/Sprunthrax-SemiBold-msdf.json", { centered: true, pixelScale: 1/64, color : [color.r, color.g, color.b, color.a] });
        this._renderEngine = renderEngine;
        this.text = text;
        this._from = from;
        this._to = to;
        this._totalTime = totalTime;
        this._totalTimeMultiplier = (Math.PI / 2) / totalTime;
    }

    tick(_deltaTime: number) {
        super.tick(_deltaTime);
        this._time += _deltaTime;
        const animationTime = Math.sin(this._time * this._totalTimeMultiplier);
        const lerped = new Vector3((this._to.x - this._from.x) * animationTime, (this._to.y - this._from.y) * animationTime, (this._to.z - this._from.z) * animationTime);
        lerped.add(this._from);
        this.transform.position.setFromVector3(lerped);
        this.transform.scale.set(animationTime*0.4, animationTime*0.4, animationTime*0.4);
        this.color = [this.color[0], this.color[1], this.color[2], 1 - (animationTime*3-1.5)];
        if(this._time > this._totalTime){
            this.transform.position.set(0, -100, 0);
        }
    }
}