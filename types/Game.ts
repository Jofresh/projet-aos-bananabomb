export type DifficultyType = 'EASY' | 'MEDIUM' | 'HARD'


export interface Game {
    id: number;
    difficulty: DifficultyType;
    map: string;
}
