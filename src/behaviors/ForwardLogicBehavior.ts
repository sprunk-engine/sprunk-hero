import {LogicBehavior} from "sprunk-engine";

/**
 * A simple logic behavior that
 */
export class ForwardLogicBehavior extends LogicBehavior<number>{
    protected speed : number;
    protected time : number = 0;
    protected offset : number;

    constructor(speed : number, offset : number) {
        super();
        this.speed = speed;
        this.offset = offset;
    }

    tick(_deltaTime: number) {
        super.tick(_deltaTime);
        this.time = this.time + _deltaTime;
        this.gameObject.transform.position.z = this.time * this.speed + this.offset;
    }
}