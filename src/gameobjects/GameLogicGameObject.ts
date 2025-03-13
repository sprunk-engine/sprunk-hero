import {GameObject, InputGameEngineComponent, RenderGameEngineComponent, Vector3} from "sprunk-engine";
import {RoadGameObject} from "./RoadGameObject.ts";
import {NotesManagerLogicBehavior} from "../behaviors/notes/NotesManagerLogicBehavior.ts";
import {FretHandleGameObject} from "./FretHandleGameObject.ts";
import {MidiParser} from "../services/MidiParser.ts";
import {SongPlayerLogicBehavior} from "../behaviors/notes/SongPlayerLogicBehavior.ts";
import {ScoreLogicBehavior} from "../behaviors/notes/ScoreLogicBehavior.ts";
import {ScoreDisplayOutputbehavior} from "../behaviors/notes/ScoreDisplayOutputbehavior.ts";
import {FretVisualFeedbackSpawnerLogicBehavior} from "../behaviors/notes/FretVisualFeedbackSpawnerLogicBehavior.ts";
import {ScoreTextsGameObject} from "./ScoreTextsGameObject.ts";

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
            noteManagter.setChart(chart.modes[0]);

            const visualFeedbackSpawner = new GameObject("VisualFeedbackSpawner");
            this.addChild(visualFeedbackSpawner);
            const visualFeedbackSpawnerBehavior = new FretVisualFeedbackSpawnerLogicBehavior(renderEngine);
            visualFeedbackSpawner.addBehavior(visualFeedbackSpawnerBehavior);

            const scoreBehavior = new ScoreLogicBehavior();
            this.addBehavior(scoreBehavior);
            noteManagter.onHitNote.addObserver((data) => {
                scoreBehavior.hitNote(data.note, data.precision);
                visualFeedbackSpawnerBehavior.showHitNote(data.note, data.precision);
            });
            noteManagter.onHitNothing.addObserver((fret) => {
                scoreBehavior.hitNothing(fret);
                visualFeedbackSpawnerBehavior.showHitNothing(fret);
            });
            noteManagter.onMissNote.addObserver((note) => {
                scoreBehavior.missNote(note);
                visualFeedbackSpawnerBehavior.showMissNote(note);
            });

            const scoreGameObject = new ScoreTextsGameObject(renderEngine, scoreBehavior);
            this.addChild(scoreGameObject);
        });
    }
}