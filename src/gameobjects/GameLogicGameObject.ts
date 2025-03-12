import {GameObject, InputGameEngineComponent, RenderGameEngineComponent} from "sprunk-engine";
import {RoadGameObject} from "./RoadGameObject.ts";
import {NotesManagerLogicBehavior} from "../behaviors/notes/NotesManagerLogicBehavior.ts";
import {FretHandleGameObject} from "./FretHandleGameObject.ts";
import {MidiParser} from "../services/MidiParser.ts";
import {SongPlayerLogicBehavior} from "../behaviors/notes/SongPlayerLogicBehavior.ts";

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


        const chart = new MidiParser().parseTrack("/assets/songs/MichaelJackson-BeatIt/song-infos.json");
        console.log(chart)
        chart.then((chart) => {

            const songPlayBack = new SongPlayerLogicBehavior(chart.song);
            this.addBehavior(songPlayBack);


            const noteManagter = new NotesManagerLogicBehavior(renderEngine, fretsLane.fretLogicBehaviors);
            this.addBehavior(noteManagter);
            noteManagter.setChart(chart, chart.modes[0]);
        });
    }
}