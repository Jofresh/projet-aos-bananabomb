import useLearningRate from "../hooks/useLearningRate";

interface LearningRateDetailsProps {
    show: boolean;
}

function LearningRateDetails({ show }: LearningRateDetailsProps) {
    const { loading, error, data } = useLearningRate(show);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    return (
        <div>
            <p>{data}</p>
        </div>
    );
}

export default LearningRateDetails;
