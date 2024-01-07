import { BOT_MOVES, GET_BOT_MOVEMENT_API_URL, MAP_SIZE, TILE_SIZE } from "../constants";
import { Coords, State } from "../types";

interface CoordsValue extends Coords {
    value: number;
}

interface Props {
    map: CoordsValue[];
}

export default async function getBotMovements({ map }: Props) {
    return fetch(GET_BOT_MOVEMENT_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                },
            body: JSON.stringify(map),
        }).then((response) => response.json())
}