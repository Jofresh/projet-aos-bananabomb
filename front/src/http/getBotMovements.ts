import { GET_BOT_MOVEMENT_API_URL } from "../constants";
import { Coords } from "../types";

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
            body: JSON.stringify({ map }),
        }).then((response) => response.json())
}
