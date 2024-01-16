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
            <p>Chemins appris par l'IA : <strong>{data?.learnedPathsNumber}</strong></p>
            <p>Taux d'apprentissage : <strong>{data?.percentageResult}</strong></p>
        </div>
    );
}

export default LearningRateDetails;
