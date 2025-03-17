import {AudioBehavior, LogicBehavior} from "sprunk-engine";
import { Song } from "../../models/Song";

/**
 * A simple logic behavior that controls a song player based on it's audio input.
 */
export class SongPlayerLogicBehavior extends LogicBehavior<number>{
    private _time : number = 0;
    private _song! : Song;
    private _audioBehaviors : AudioBehavior[] = [];

    constructor(song : Song) {
        super();
        this._song = song;
    }

    protected onEnable(): void {
        super.onEnable();
        this.loadSong().then(() => this.play());
    }

    tick(_deltaTime: number) {
        if(this._audioBehaviors.length === 0) return;
        this._time = this._audioBehaviors[0].getTimestamp();
        this.data = this._time;
        this.notifyDataChanged();
        super.tick(_deltaTime);
    }

    /**
     * Load all the song parts
     */
    private async loadSong() {
        await Promise.all(this._song.songPartsPath.map(async (partPath) => {
            const audioBehavior = new AudioBehavior();
            await audioBehavior.setAudio(partPath);
            this.gameObject.addBehavior(audioBehavior);
            this._audioBehaviors.push(audioBehavior);
        }));
    }

    /**
     * Play all the song parts (only to be called once every part is loaded)
     */
    private play() {
        this.gameObject.getBehaviors(AudioBehavior).forEach((audioBehavior) => {
            audioBehavior.play();
        });
    }
}