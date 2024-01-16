import { DELETE_STOP_GAME_API_URL } from "../constants";

interface DeleteStopGameProps {
    body: {
        id: number | null;
    };
}

export default async function deleteStopGame({ body }: DeleteStopGameProps) {
    try {
        const response = await fetch(DELETE_STOP_GAME_API_URL, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return !!response?.ok;
    } catch (error) {}
}
