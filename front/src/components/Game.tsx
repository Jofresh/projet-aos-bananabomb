import { useEffect, useReducer, useCallback, useState } from "react";
import { Stage, TilingSprite } from "@pixi/react";
import {
    MAP_SIZE,
    TILE_SIZE,
    BLOCKS,
    BOMB_DELAY,
    EXPLOSION_DELAY,
    BOT_MOVES,
    API_CALL_DELAY,
} from "../constants";
import Block from "./Block";
import Brick from "./Brick";
import Bomb from "./Bomb";
import Explosion from "./Explosion";
import Player from "./Player";
import Bot from "./Bot";
import useInterval from "../hooks/useInterval";
import useOnStart from "../hooks/useOnStart";
import getBotMovements from "../http/getBotMovements";
import { Coords } from "../types";
import { formatMapForBack } from "../utils/map";
import { reducer, initialState, ACTIONS } from "../reducers/game";
import "../styles/game.css"
import deleteStopGame from "../http/deleteStopGame";
import LearningRateDetails from "./LearningRateDetails";

function Game() {
    const [state, dispatch] = useReducer(reducer, initialState);

    const [displayLearningRate, setDisplayLearningRate] = useState(false);

    // Set the game difficulty and grid size, calling the API
    const { gameId, restartGame } = useOnStart();

    const onEndGame = async () => {
        await deleteStopGame({ body: { id: gameId } });

        setDisplayLearningRate(true);
    };

    const resetGame = useCallback(() => {
        dispatch({ type: ACTIONS.RESET_GAME });

        // Call API to reinit game
        restartGame();

        setDisplayLearningRate(false);
    }, []);

    // Function to check if the player is colliding with a block, a brick or a bomb to prevent him from moving
    const checkCollision = useCallback(
        (coords: Coords) => {
            return (
                BLOCKS.some(
                    (block) => block.x === coords.x && block.y === coords.y
                ) ||
                state.bricks.some(
                    (block) => block.x === coords.x && block.y === coords.y
                ) ||
                state.bombs.some(
                    (bomb) => bomb.x === coords.x && bomb.y === coords.y
                )
            );
        },
        [BLOCKS, state.bricks, state.bombs]
    );

    const moveBot = useCallback(() => {
        getBotMovements({ map: formatMapForBack(state) }).then((payload: any) => {
            if (!payload) return;

            let nextMoves = payload.nextMoves;
            let latestCoords = state.botCoords;
            
            const botMoveInterval = setInterval(() => {
                const { x, y } = latestCoords;
                let newCoords = null;

                switch (nextMoves[0]) {
                    case BOT_MOVES.UP:
                        newCoords = { x, y: y - TILE_SIZE };
                        break;
                    case BOT_MOVES.DOWN:
                        newCoords = { x, y: y + TILE_SIZE };
                        break;
                    case BOT_MOVES.LEFT:
                        newCoords = { x: x - TILE_SIZE, y };
                        break;
                    case BOT_MOVES.RIGHT:
                        newCoords = { x: x + TILE_SIZE, y };
                        break;
                    default:
                        return;
                }

                if (
                    newCoords &&
                    !checkCollision(newCoords) &&
                    newCoords.x >= 0 &&
                    newCoords.y >= 0 &&
                    newCoords.x <= MAP_SIZE - TILE_SIZE &&
                    newCoords.y <= MAP_SIZE - TILE_SIZE
                ) {
                    latestCoords = newCoords;
                    dispatch({ type: ACTIONS.MOVE_BOT, payload: newCoords });
                }

                nextMoves = nextMoves.slice(1);
                
                if (nextMoves.length === 0) {
                    clearInterval(botMoveInterval);
                    
                    // Plant bomb randomly (done client-side, not server-side)
                    const plantsBomb = Math.random() < (1 / 8);
                    if (plantsBomb) {
                        const newBomb = { ...latestCoords };
                        dispatch({ type: ACTIONS.ADD_BOMB, payload: newBomb });
                        setTimeout(() => {
                            dispatch({ type: ACTIONS.REMOVE_BOMB, payload: newBomb });
                            const zones = [
                                { x: newBomb.x, y: newBomb.y },
                                { x: newBomb.x + TILE_SIZE, y: newBomb.y },
                                { x: newBomb.x - TILE_SIZE, y: newBomb.y },
                                { x: newBomb.x, y: newBomb.y + TILE_SIZE },
                                { x: newBomb.x, y: newBomb.y - TILE_SIZE },
                            ];
                            dispatch({ type: ACTIONS.ADD_EXPLOSION, payload: zones });
                            setTimeout(() => {
                                dispatch({ type: ACTIONS.REMOVE_EXPLOSIONS, payload: zones });
                            }, EXPLOSION_DELAY);
                        }, BOMB_DELAY);
                    }
                }
            }, (API_CALL_DELAY / 3) - 100);
        });
    }, [state, checkCollision]);

    const onPressArrows = useCallback(
        (e: KeyboardEvent) => {
            const { x, y } = state.coords;
            let newCoords = null;
            switch (e.key) {
                case "ArrowUp":
                    newCoords = { x, y: y - TILE_SIZE };
                    break;
                case "ArrowDown":
                    newCoords = { x, y: y + TILE_SIZE };
                    break;
                case "ArrowLeft":
                    newCoords = { x: x - TILE_SIZE, y };
                    break;
                case "ArrowRight":
                    newCoords = { x: x + TILE_SIZE, y };
                    break;
                default:
                    return;
            }
            if (
                newCoords &&
                !checkCollision(newCoords) &&
                newCoords.x >= 0 &&
                newCoords.y >= 0 &&
                newCoords.x <= MAP_SIZE - TILE_SIZE &&
                newCoords.y <= MAP_SIZE - TILE_SIZE
            ) {
                dispatch({ type: ACTIONS.SET_COORDS, payload: newCoords });
            }
        },
        [state.coords, checkCollision]
    );

    const onPressSpace = useCallback(
        (e: KeyboardEvent) => {
            if (e.key !== " ") return;
            const newBomb = { ...state.coords };
            dispatch({ type: ACTIONS.ADD_BOMB, payload: newBomb });
            setTimeout(() => {
                dispatch({ type: ACTIONS.REMOVE_BOMB, payload: newBomb });
                const zones = [
                    { x: newBomb.x, y: newBomb.y },
                    { x: newBomb.x + TILE_SIZE, y: newBomb.y },
                    { x: newBomb.x - TILE_SIZE, y: newBomb.y },
                    { x: newBomb.x, y: newBomb.y + TILE_SIZE },
                    { x: newBomb.x, y: newBomb.y - TILE_SIZE },
                ];
                dispatch({ type: ACTIONS.ADD_EXPLOSION, payload: zones });
                setTimeout(() => {
                    dispatch({ type: ACTIONS.REMOVE_EXPLOSIONS, payload: zones });
                }, EXPLOSION_DELAY);
            }, BOMB_DELAY);
        },
        [state.coords]
    );

    // Move bot every 3 seconds
    useInterval(() => {
        if (state.gameOver || state.wonGame) return;
        moveBot();
    }, API_CALL_DELAY);

    // Define key listeners
    useEffect(() => {
        if (state.gameOver || state.wonGame) return;
        window.addEventListener("keydown", onPressArrows);
        window.addEventListener("keypress", onPressSpace);
        return () => {
            window.removeEventListener("keypress", onPressSpace);
            window.removeEventListener("keydown", onPressArrows);
        };
    }, [onPressArrows, onPressSpace, state.gameOver, state.wonGame]);

    // Handle the end of the game
    useEffect(() => {
        if (state.gameOver || state.wonGame) return;

        // Check if player is in explosion zone
        if (
            state.explosions.some(
                (explosion) =>
                    explosion.x === state.coords.x &&
                    explosion.y === state.coords.y
            )
        ) {
            dispatch({ type: ACTIONS.SET_GAME_OVER });

            onEndGame();
            return;
        }

        const explodedBricks = state.bricks.filter((brick) =>
            state.explosions.some(
                (explosion) =>
                    explosion.x === brick.x && explosion.y === brick.y
            )
        );

        // Remove exploded bricks
        if (explodedBricks.length > 0) {
            dispatch({
                type: ACTIONS.REMOVE_BRICKS,
                payload: explodedBricks.map((brick) => ({
                    x: brick.x,
                    y: brick.y,
                })),
            });
        }

        // Check if player is in explosion zone
        if (
            state.explosions.some(
                (explosion) =>
                    explosion.x === state.botCoords.x &&
                    explosion.y === state.botCoords.y
            )
        ) {
            dispatch({ type: ACTIONS.SET_GAME_WIN });

            onEndGame();
        }
    }, [state.coords, state.explosions, state.botCoords, state.gameOver, state.wonGame]);

    return (
        <>
            <Stage width={MAP_SIZE} height={MAP_SIZE}>
                <TilingSprite
                    image={"/damier.png"}
                    width={MAP_SIZE}
                    height={MAP_SIZE}
                    tilePosition={{ x: 0, y: 0 }}
                    tileScale={{ x: 1, y: 1 }}
                />
                {state.bombs.map((bomb, index) => (
                    <Bomb key={index} x={bomb.x} y={bomb.y} />
                ))}
                <Player x={state.coords.x} y={state.coords.y} />
                <Bot x={state.botCoords.x} y={state.botCoords.y} />
                {state.explosions.map((explosion, index) => (
                    <Explosion key={index} x={explosion.x} y={explosion.y} />
                ))}
                {BLOCKS.map((block, index) => (
                    <Block key={index} x={block.x} y={block.y} />
                ))}
                {state.bricks.map((brick, index) => (
                    <Brick key={index} x={brick.x} y={brick.y} />
                ))}
            </Stage>
            <div className="result-container">
                {state.gameOver && (
                    <div className="game-over">
                        <h1>Game over</h1>
                        <button onClick={resetGame}>Restart</button>
                    </div>
                )}
                {state.wonGame && (
                    <div className="game-over">
                        <h1>You win</h1>
                        <button onClick={resetGame}>Restart</button>
                    </div>
                )}
                {displayLearningRate && <LearningRateDetails show={displayLearningRate} />}
            </div>
        </>
    );
}

export default Game;
