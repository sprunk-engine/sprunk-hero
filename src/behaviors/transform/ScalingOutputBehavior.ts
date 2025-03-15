import { OutputBehavior, Vector3} from "sprunk-engine";

/**
 * A simple output behavior that scales the object from one scale to another in a given amount of time.
 */
export class ScalingOutputBehavior extends OutputBehavior{
    private _totalTime : number;
    /**
     * Should go from 0 to (Math.PI / 2) in X amount of time defined in the constructor
     * @private
     */
    private _totalTimeMultiplier : number;
    private _time : number = 0;
    private _from : Vector3 | null = null;
    private _to : Vector3 | null = null;

    constructor(totalTime : number) {
        super();
        this._totalTime = totalTime;
        this._totalTimeMultiplier = (Math.PI / 2) / totalTime;
    }

    transitionToScale(target : Vector3){
        this._from = this.transform.scale.clone();
        this._to = target;
        this._time = 0;
    }

    tick(_deltaTime: number) {
        super.tick(_deltaTime);
        if(this._from == null || this._to == null) return;
        if(this._time >= this._totalTime) return;
        this._time += _deltaTime;
        const animationTime = Math.sin(this._time * this._totalTimeMultiplier);
        const lerped = new Vector3((this._to.x - this._from.x) * animationTime, (this._to.y - this._from.y) * animationTime, (this._to.z - this._from.z) * animationTime);
        lerped.add(this._from);
        this.transform.scale.setFromVector3(lerped);
    }
}