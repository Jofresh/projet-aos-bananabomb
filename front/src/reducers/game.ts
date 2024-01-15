
import { BRICKS, MAP_SIZE, TILE_SIZE } from "../constants";
import { Action, Coords, State } from "../types";

export const initialState = {
    coords: { x: 0, y: 0 },
    botCoords: { x: MAP_SIZE - TILE_SIZE, y: MAP_SIZE - TILE_SIZE },
    bombs: [],
    explosions: [],
    gameOver: false,
    wonGame: false,
    bricks: BRICKS,
};

export const ACTIONS = {
    SET_COORDS: "SET_COORDS",
    MOVE_BOT: "MOVE_BOT",
    ADD_BOMB: "ADD_BOMB",
    REMOVE_BOMB: "REMOVE_BOMB",
    ADD_EXPLOSION: "ADD_EXPLOSION",
    REMOVE_EXPLOSIONS: "REMOVE_EXPLOSIONS",
    REMOVE_BRICKS: "REMOVE_BRICKS",
    SET_GAME_OVER: "SET_GAME_OVER",
    SET_GAME_WIN: "SET_GAME_WIN",
    RESET_GAME: "RESET_GAME",
};

export function reducer(state: State, action: Action) {
    switch (action.type) {
        case ACTIONS.SET_COORDS:
            return { ...state, coords: action.payload };
        case ACTIONS.MOVE_BOT:
            return { ...state, botCoords: action.payload };
        case ACTIONS.ADD_BOMB:
            return { ...state, bombs: [...state.bombs, action.payload] };
        case ACTIONS.REMOVE_BOMB:
            return { ...state, bombs: state.bombs.filter(bomb => !(bomb.x === action.payload.x && bomb.y === action.payload.y)) };
        case ACTIONS.ADD_EXPLOSION:
            return { ...state, explosions: [...state.explosions, ...action.payload] };
        case ACTIONS.REMOVE_EXPLOSIONS:
            return { ...state, explosions: state.explosions.filter(explosion => !action.payload.some((zone: Coords) => zone.x === explosion.x && zone.y === explosion.y)) };
        case ACTIONS.REMOVE_BRICKS:
            return { ...state, bricks: state.bricks.filter(brick => !action.payload.some((zone: Coords) => zone.x === brick.x && zone.y === brick.y)) };
        case ACTIONS.SET_GAME_OVER:
            return { ...state, gameOver: true };
        case ACTIONS.SET_GAME_WIN:
            return { ...state, wonGame: true };
        case ACTIONS.RESET_GAME:
            return initialState;
        default:
            throw new Error();
    }
}
