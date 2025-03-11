import {ForwardOutputBehavior} from "./ForwardOutputBehavior.ts";

/**
 * A simple logic behavior that move in Z direction the gameobject attached to
 */
export class RepeatableForwardOutputBehavior extends ForwardOutputBehavior{
    private _repeatCoordinate : number;

    constructor(speed : number, offset : number, repeatCoordinate : number) {
        super(speed, offset);
        this._repeatCoordinate = repeatCoordinate;
    }

    tick(_deltaTime: number) {
        super.tick(_deltaTime);
        if(this.transform.position.z > this._repeatCoordinate){
            this.time = 0;
        }
    }
}