export interface gameTile {
    x: number;
    y: number;
    value: number;
}

export interface bestPath {
    path: gameTile[];
    score: number;
}
