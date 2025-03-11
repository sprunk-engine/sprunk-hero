import {GameObject, InputGameEngineComponent, RenderGameEngineComponent} from "sprunk-engine";
import {RoadGameObject} from "./RoadGameObject.ts";
import {NotesManagerLogicBehavior} from "../behaviors/notes/NotesManagerLogicBehavior.ts";
import {SongPlayerLogicBehavior} from "../behaviors/notes/SongPlayerLogicBehavior.ts";
import {FretHandleGameObject} from "./FretHandleGameObject.ts";
import {ChartParser} from "../services/chart/ChartParser.ts";

/**
 * A GameObject that hold ann the movables components + game logic components of the scene (exluding camera, effects and background)
 */
export class GameLogicGameObject extends GameObject{
    constructor(renderEngine: RenderGameEngineComponent, inputEngine : InputGameEngineComponent) {
        super("GameLogic");

        const fretsLane = new FretHandleGameObject(renderEngine, inputEngine);
        this.addChild(fretsLane);

        const road = new RoadGameObject(renderEngine);
        this.addChild(road);

        const sontPlayBack = new SongPlayerLogicBehavior();
        this.addBehavior(sontPlayBack);
        const noteManagter = new NotesManagerLogicBehavior(renderEngine, fretsLane.fretLogicBehaviors);
        this.addBehavior(noteManagter);

        const chart = new ChartParser().parse("/assets/songs/BillyTalen-RedFlag/notes.chart");
        console.log(chart)
        noteManagter.setChart(chart, chart.modes[0]);
    }
}