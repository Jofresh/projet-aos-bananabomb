import { useEffect, useState } from "react";
import { DIFFICULTY, GRID_SIZE } from "../constants";
import postInitGame from "../http/postInitGame";

export default function useOnStart() {
    const [gameId, setGameId] = useState<number | null>(null);

    const initGame = async () => {
        const id = Date.now();
        
        const body = {
            id,
            difficulty: DIFFICULTY.EASY,
            gridSize: GRID_SIZE,
        };

        await postInitGame({ body });
        
        setGameId(id);
    };

    const restartGame = () => {
        initGame();
    };

    useEffect(() => {
        initGame();
    }, []);

    return { gameId, restartGame };
}
