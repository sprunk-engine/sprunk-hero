import {ForwardLogicBehavior} from "./ForwardLogicBehavior.ts";

export class RepeatableForwardLogicBehavior extends ForwardLogicBehavior{
    private _repeatCoordinate : number;

    constructor(speed : number, offset : number, repeatCoordinate : number) {
        super(speed, offset);
        this._repeatCoordinate = repeatCoordinate;
    }

    tick(_deltaTime: number) {
        super.tick(_deltaTime);
        if(this.gameObject.transform.position.z > this._repeatCoordinate){
            this.time = 0;
        }
    }
}