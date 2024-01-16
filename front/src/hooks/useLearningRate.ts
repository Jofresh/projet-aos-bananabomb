import { useEffect, useState } from "react";
import getLearningRate from "../http/getLearningRate";

function useLearningRate(show: boolean) {
    const [data, setData] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!show) return;

        setLoading(true);
        getLearningRate()
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });

        return () => {
            setData(null);
            setLoading(false);
            setError(null);
        };
    }, [show]);
    
    return { loading, error, data };
}

export default useLearningRate;
