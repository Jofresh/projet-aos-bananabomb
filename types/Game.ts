
export type DifficultyType = 'EASY' | 'MEDIUM' | 'HARD'
/*

export interface Game {
    id: number;
    difficulty: DifficultyType;
    map: string;
}
*/

export class Game{
    id: number;
    difficulty: DifficultyType;
    map: string;
    nbBot: number;
    

    constructor(id: number, difficulty: DifficultyType, map: string, nbBot: number){
        this.id = id;
        this.difficulty = difficulty;
        this.map = map;
        this.nbBot = nbBot;
    }

    getGame(){
        return this;
    }
}

