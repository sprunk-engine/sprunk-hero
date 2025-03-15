import {
    Camera, Event,
    GameObject,
    InputGameEngineComponent,
    Renderer,
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

    /**
     * Creates a new ButtonGameObject.
     * @param camera
     * @param inputEngineComponent
     * @param renderEngine
     * @param spriteImageUrl
     * @param perceivedSize - The perceived size of the button (hit box of image) between 0 and 1 (1 being the size of the corners of image).
     */
    constructor(camera: Camera, inputEngineComponent: InputGameEngineComponent, renderEngine: Renderer, spriteImageUrl: RequestInfo | URL, perceivedSize : Vector2) {
        super("Button");

        this.addBehavior(new SpriteRenderBehavior(renderEngine, spriteImageUrl));
        const logicBehavior = new ButtonLogicBehavior(perceivedSize);
        this.addBehavior(logicBehavior);
        this.addBehavior(new ButtonInputBehavior(camera, inputEngineComponent, logicBehavior));
        const scalingOutputBehavior = new ScalingOutputBehavior(0.1);
        logicBehavior.onDataChanged.addObserver((data) => {
            if(data.hovered){
                if(data.clicked){
                    scalingOutputBehavior.transitionToScale(new Vector3(0.5, 0.5, 1));
                } else {
                    scalingOutputBehavior.transitionToScale(new Vector3(1.25, 1.25, 1));
                }
            }else{
                scalingOutputBehavior.transitionToScale(new Vector3(1,1,1));
            }
        });
        logicBehavior.onButtonPressAndRelease.addObserver(() => {
            this.onClicked.emit();
        });
        this.addBehavior(scalingOutputBehavior)
    }
}