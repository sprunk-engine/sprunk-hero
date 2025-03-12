export interface Score {
    /**
     * The score of the player
     */
    score: number;
    /**
     * The streak of the player
     */
    streak: number;
    /**
     * The multiplier of the player
     */
    multiplier: number;
}

export const defaultScore: Score = {
    score: 0,
    streak: 0,
    multiplier: 1
}