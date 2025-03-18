import {
  GameObject,
} from "sprunk-engine";
import { RoadGameObject } from "./RoadGameObject.ts";
import { NotesManagerLogicBehavior } from "../behaviors/notes/NotesManagerLogicBehavior.ts";
import { FretHandleGameObject } from "./FretHandleGameObject.ts";
import { SongPlayerLogicBehavior } from "../behaviors/notes/SongPlayerLogicBehavior.ts";
import { ScoreLogicBehavior } from "../behaviors/notes/ScoreLogicBehavior.ts";
import { FretVisualFeedbackSpawnerLogicBehavior } from "../behaviors/notes/FretVisualFeedbackSpawnerLogicBehavior.ts";
import { ScoreTextsGameObject } from "./ScoreTextsGameObject.ts";
import { ParserService } from "../services/ParserService.ts";

/**
 * A GameObject that hold ann the movables components + game logic components of the scene (exluding camera, effects and background)
 */
export class GameLogicGameObject extends GameObject {
  constructor() {
    super("GameLogic");
  }

  protected onEnable() {
    super.onEnable();
    this.loadGame();
  }

  async loadGame() {
    const fretsLane = new FretHandleGameObject();
    this.addChild(fretsLane);

    this.addChild(new RoadGameObject());

    const manifestPath = "/assets/songs/MichaelJackson-BeatIt/song-infos.json";

    try {
      const parser = await ParserService.createParser(manifestPath);

      const chart = await parser.parseTrack(manifestPath);

      if (!chart.modes || chart.modes.length === 0) {
        console.error("No difficulty modes found in chart");
        return;
      }

      const songPlayBack = new SongPlayerLogicBehavior(chart.song);
      this.addBehavior(songPlayBack);

      const noteManagter = new NotesManagerLogicBehavior(
        fretsLane.fretLogicBehaviors
      );
      this.addBehavior(noteManagter);
      noteManagter.setChart(chart.modes[0]);

      const visualFeedbackSpawner = new GameObject("VisualFeedbackSpawner");
      this.addChild(visualFeedbackSpawner);
      const visualFeedbackSpawnerBehavior =
        new FretVisualFeedbackSpawnerLogicBehavior();
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

      const scoreGameObject = new ScoreTextsGameObject(scoreBehavior);
      this.addChild(scoreGameObject);
    } catch (error) {
      console.error("Failed to load chart:", error);
    }
  }
}
