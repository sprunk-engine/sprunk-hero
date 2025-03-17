import {Camera, DeviceInputBehavior, InputGameEngineComponent, Vector2} from "sprunk-engine";
import {ButtonLogicBehavior} from "./ButtonLogicBehavior.ts";

/**
 * A behavior that handles mouse input for a button.
 */
export class ButtonInputBehavior extends DeviceInputBehavior{
    private readonly _camera: Camera;
    private readonly _button: ButtonLogicBehavior;

    constructor(camera : Camera, inputEngineComponent: InputGameEngineComponent, button: ButtonLogicBehavior) {
        super(inputEngineComponent);
        this._camera = camera;
        this._button = button;
    }

    onMouseMove(_data: { position: Vector2; delta: Vector2 }) {
        super.onMouseMove(_data);
        const dir = this._camera.screenPointToWorldDirection(_data.position);
        this._button.changePointedDirection(this._camera.worldPosition, dir);
    }

    onMouseLeftClickDown() {
        super.onMouseLeftClickDown();
        this._button.pointerDown();
    }

    onMouseLeftClickUp() {
        super.onMouseLeftClickUp();
        this._button.pointerUp();
    }
}