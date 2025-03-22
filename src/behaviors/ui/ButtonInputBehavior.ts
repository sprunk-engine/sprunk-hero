import {DeviceInputBehavior, InjectGlobal, RenderGameEngineComponent, Vector2} from "sprunk-engine";
import {ButtonLogicBehavior} from "./ButtonLogicBehavior.ts";

/**
 * A behavior that handles mouse input for a button.
 */
export class ButtonInputBehavior extends DeviceInputBehavior{
    private readonly _button: ButtonLogicBehavior;

    @InjectGlobal(RenderGameEngineComponent)
    private _renderEngine!: RenderGameEngineComponent;

    constructor(button: ButtonLogicBehavior) {
        super();
        this._button = button;
    }

    onMouseMove(_data: { position: Vector2; delta: Vector2 }) {
        super.onMouseMove(_data);
        const camera = this._renderEngine.camera;
        if(camera === null) return;
        const dir = camera.screenPointToWorldDirection(_data.position);
        this._button.changePointedDirection(camera.worldPosition, dir);
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