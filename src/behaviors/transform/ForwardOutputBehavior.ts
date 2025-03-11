import {OutputBehavior} from "sprunk-engine";

/**
 * A simple logic behavior that move in Z direction the gameobject attached to
 */
export class ForwardOutputBehavior extends OutputBehavior{
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
        this.transform.position.z = this.time * this.speed + this.offset;
    }
}