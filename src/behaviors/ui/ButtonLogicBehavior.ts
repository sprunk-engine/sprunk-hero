import {Event, LogicBehavior, RenderEngineUtility, Vector2, Vector3} from "sprunk-engine";

/**
 * A behavior that contains logic for a UI button (hover, click, etc).
 */
export class ButtonLogicBehavior extends LogicBehavior<{ hovered: boolean, clicked: boolean }> {
    /**
     * Event emitted when the button is truly clicked (pressed and released while hovered).
     */
    public onButtonPressAndRelease: Event<void> = new Event<void>();

    private _size: Vector2;

    /**
     * Creates a new ButtonLogicBehavior.
     * @param size - The perceived size of the button (hit box of image) between 0 and 1 (1 being the size of the corners of image).
     */
    constructor(size: Vector2) {
        super();
        this._size = size;
        this.data = { hovered: false, clicked: false };
    }

    /**
     * When the pointer is moved. All coordinates are expected to be in world space.
     * @param origin - The origin of the ray.
     * @param dir - The direction of the ray.
     */
    changePointedDirection(origin: Vector3, dir: Vector3) {
        const planePoint = this.gameObject.transform.worldPosition;
        const planeNormal = this.gameObject.transform.forward;
        const pointInPlane = RenderEngineUtility.rayPlaneIntersection(origin, dir, planeNormal, planePoint);
        if (!pointInPlane) return;
        const pointInLocalSpace = this.gameObject.transform.worldToLocalPosition(pointInPlane);
        pointInLocalSpace.z = 0;
        const isHovered = this.isHovered(pointInLocalSpace.toVector2());
        if(this.data.hovered !== isHovered){
            this.data.hovered = isHovered;
            this.notifyDataChanged();
        }
    }

    /**
     * Call this when the pointer is down.
     * This will set the clicked state to true if the button is hovered.
     */
    pointerDown() {
        if(!this.data.hovered) return;
        this.data.clicked = true;
        this.notifyDataChanged();
    }

    /**
     * Call this when the pointer is up.
     * This will emit the onButtonPressAndRelease event if the button was clicked and hovered.
     */
    pointerUp() {
        if (this.data.clicked && this.data.hovered) {
            this.onButtonPressAndRelease.emit();
        }
        if(!this.data.clicked) return;
        this.data.clicked = false;
        this.notifyDataChanged();
    }

    private isHovered(localPoint: Vector2): boolean {
        const size = this._size.clone().scaleAxis(this.gameObject.transform.worldScale.toVector2());
        return Math.abs(localPoint.x) < size.x / 2 && Math.abs(localPoint.y) < size.y / 2;
    }
}