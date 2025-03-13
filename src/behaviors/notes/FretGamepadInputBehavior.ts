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

  protected override onEnable(): void {
    super.onEnable();
    const gamepad = this.inputEngineComponent.getDevice(GamepadDevice);
    if (gamepad) {
      console.log("Gamepads", gamepad);
      gamepad.onButtonDown.addObserver((buttonIndex) => {
        this.onGamepadButtonDown(buttonIndex);
        console.log("Gamepad button down", buttonIndex);
      });
    }

    this.inputEngineComponent.onDeviceAdded.addObserver((device) => {
      console.log("Device added", device);
      if (device instanceof GamepadDevice) {
        device.onButtonDown.addObserver((buttonIndex) => {
          this.onGamepadButtonDown(buttonIndex);
          console.log("Gamepad button down", buttonIndex);
        });
      }
    });
  }

  protected onPressed() {
    this._logic.onPressed();
  }

  protected onReleased() {
    this._logic.onReleased();
  }
}
