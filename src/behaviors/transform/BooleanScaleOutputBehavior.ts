import {GameObject, LogicBehavior, OutputBehavior} from "sprunk-engine";

export class BooleanScaleOutputBehavior extends OutputBehavior{
    private _isPressed : boolean = false;
    private _currentScale : number;
    private readonly _scaleNormal : number
    private readonly _scalePressed : number;
    private readonly _mulToChangeScale : number;

    constructor(scaleNormal : number, scalePressed : number, speedToChangeScale : number) {
        super();
        this._scaleNormal = scaleNormal;
        this._scalePressed = scalePressed;
        this._currentScale = scaleNormal
        this._mulToChangeScale = 1/speedToChangeScale;
    }

    setup(attachedOn: GameObject) {
        super.setup(attachedOn);
        this.observe(LogicBehavior<boolean>, (data : boolean) => {
            this._isPressed = data;
        });
    }

    tick(_deltaTime: number) {
        super.tick(_deltaTime);
        //Lerp the scale of the fret
        const scale = this._isPressed ? this._scalePressed : this._scaleNormal;
        this._currentScale = this._currentScale + (scale - this._currentScale) * this._mulToChangeScale * _deltaTime;
        this.transform.scale.set(this._currentScale, this._currentScale, this._currentScale);
    }
}