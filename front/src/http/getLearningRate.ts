import { GET_LEARNING_RATE_API_URL } from "../constants";

export default async function getLearningRate() {
    return fetch(GET_LEARNING_RATE_API_URL, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            },
        }).then((response) => response.json())
}
