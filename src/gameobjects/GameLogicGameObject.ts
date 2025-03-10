import {GameObject, InputGameEngineComponent, RenderGameEngineComponent} from "sprunk-engine";
import {FretLaneGameObject} from "./FretLaneGameObject.ts";
import {RoadGameObject} from "./RoadGameObject.ts";
import {NotesManagerLogicBehavior} from "../behaviors/notes/NotesManagerLogicBehavior.ts";
import {SongPlayerLogicBehavior} from "../behaviors/notes/SongPlayerLogicBehavior.ts";

export class GameLogicGameObject extends GameObject{
    constructor(renderEngine: RenderGameEngineComponent, inputEngine : InputGameEngineComponent) {
        super("GameLogic");

        const fretsLane = new FretLaneGameObject(renderEngine, inputEngine);
        this.addChild(fretsLane);

        const road = new RoadGameObject(renderEngine);
        this.addChild(road);

        const noteManagter = new NotesManagerLogicBehavior(fretsLane.fretLogicBehaviors);
        this.addBehavior(noteManagter);
        const sontPlayBack = new SongPlayerLogicBehavior();
        this.addBehavior(sontPlayBack);
    }
}