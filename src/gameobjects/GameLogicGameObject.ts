import {GameObject, InputGameEngineComponent, RenderGameEngineComponent} from "sprunk-engine";
import {RoadGameObject} from "./RoadGameObject.ts";
import {NotesManagerLogicBehavior} from "../behaviors/notes/NotesManagerLogicBehavior.ts";
import {FretHandleGameObject} from "./FretHandleGameObject.ts";
import {MidiParser} from "../services/MidiParser.ts";

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

        const noteManagter = new NotesManagerLogicBehavior(renderEngine, fretsLane.fretLogicBehaviors);
        this.addBehavior(noteManagter);

        const chart = new MidiParser().parseTrack("/assets/songs/MichaelJackson-BeatIt/song-infos.json");
        console.log(chart)
        chart.then((chart) => {
            noteManagter.setChart(chart, chart.modes[0]);
        });
    }
}