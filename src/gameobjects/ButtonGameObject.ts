import {
    Event,
    GameObject,
    SpriteRenderBehavior, Vector2, Vector3
} from "sprunk-engine";
import {ButtonLogicBehavior} from "../behaviors/ui/ButtonLogicBehavior.ts";
import {ButtonInputBehavior} from "../behaviors/ui/ButtonInputBehavior.ts";
import {ScalingOutputBehavior} from "../behaviors/transform/ScalingOutputBehavior.ts";

export class ButtonGameObject extends GameObject{
    /**
     * When the button is clicked.
     */
    public onClicked : Event<void> = new Event<void>();

    private _perceivedSize: Vector2;
    private _spriteImageUrl: RequestInfo | URL;
    private _normalScale: number;
    private _hoverScale: number;
    private _clickScale: number;

    /**
     * Creates a new ButtonGameObject.
     * @param spriteImageUrl
     * @param perceivedSize - The perceived size of the button (hit box of image) between 0 and 1 (1 being the size of the corners of image).
     */
    constructor(spriteImageUrl: RequestInfo | URL, perceivedSize : Vector2,
                normalScale: number = 1,
                hoverScale: number = 1.25,
                clickScale: number = 0.5) {
        super("Button");
        this._spriteImageUrl = spriteImageUrl;
        this._perceivedSize = perceivedSize;
        this._normalScale = normalScale;
        this._hoverScale = hoverScale;
        this._clickScale = clickScale;
    }

    protected onEnable() {
        super.onEnable();

        this.addBehavior(new SpriteRenderBehavior(this._spriteImageUrl));
        const logicBehavior = new ButtonLogicBehavior(this._perceivedSize);
        this.addBehavior(logicBehavior);
        this.addBehavior(new ButtonInputBehavior(logicBehavior));
        const scalingOutputBehavior = new ScalingOutputBehavior(0.1);
        logicBehavior.onDataChanged.addObserver((data) => {
            if (data.hovered) {
                if (data.clicked) {
                  scalingOutputBehavior.transitionToScale(
                    new Vector3(this._clickScale, this._clickScale, 1)
                  );
                } else {
                  scalingOutputBehavior.transitionToScale(
                    new Vector3(this._hoverScale, this._hoverScale, 1)
                  );
                }
              } else {
                scalingOutputBehavior.transitionToScale(
                  new Vector3(this._normalScale, this._normalScale, 1)
                );
              }
            });

            this.transform.scale.setFromVector3(
              new Vector3(this._normalScale, this._normalScale, 1)
            );
        logicBehavior.onButtonPressAndRelease.addObserver(() => {
            this.onClicked.emit();
        });
        this.addBehavior(scalingOutputBehavior)
    }
}