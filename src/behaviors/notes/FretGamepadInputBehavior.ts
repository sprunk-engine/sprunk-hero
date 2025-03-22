import {DeviceInputBehavior, Inject} from "sprunk-engine";
import { FretLogicBehavior } from "./FretLogicBehavior.ts";

/**
 * A logic behavior that controls a fret input with gamepad input.
 */
export class FretGamepadInputBehavior extends DeviceInputBehavior {
  @Inject(FretLogicBehavior,false)
  private _logic!: FretLogicBehavior;
  private _buttonState: boolean = false;

  onGamepadButtonDown(_buttonIndex: number) {
    super.onGamepadButtonDown(_buttonIndex);
    if (_buttonIndex === this._logic.fret.gamepadKey) {
      this._buttonState = true;
    }
    if (_buttonIndex === 12 || _buttonIndex === 13) {
      if (this._buttonState) {
        this.onPressed();
      }
    }
  }

  onGamepadButtonUp(_buttonIndex: number) {
    super.onGamepadButtonUp(_buttonIndex);
    if (_buttonIndex === this._logic.fret.gamepadKey) {
      this._buttonState = false;
      this.onReleased();
    }

    if (_buttonIndex === 12 || _buttonIndex === 13) {
      if (this._buttonState) {
        this.onReleased();
      }
    }
  }

  protected onPressed() {
    this._logic.onPressed();
  }

  protected onReleased() {
    this._logic.onReleased();
  }
}
