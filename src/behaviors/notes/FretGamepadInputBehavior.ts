import { DeviceInputBehavior, InputGameEngineComponent } from "sprunk-engine";
import { FretLogicBehavior } from "./FretLogicBehavior.ts";
import { GamepadDevice } from "sprunk-engine";

/**
 * A logic behavior that controls a fret input with gamepad input.
 */
export class FretGamepadInputBehavior extends DeviceInputBehavior {
  private _logic: FretLogicBehavior;

  constructor(
    inputEngineComponent: InputGameEngineComponent,
    logic: FretLogicBehavior
  ) {
    super(inputEngineComponent);
    this._logic = logic;
  }

  onGamepadButtonDown(_buttonIndex: number) {
    super.onGamepadButtonDown(_buttonIndex);
    console.log(_buttonIndex)
  }

  protected onPressed() {
    this._logic.onPressed();
  }

  protected onReleased() {
    this._logic.onReleased();
  }
}
