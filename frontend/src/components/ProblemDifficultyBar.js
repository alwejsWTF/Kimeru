const ProblemDifficultyBar = ({ points, width, height }) => {
    const totalSquares = 10;

    const getColor = (index) => {
        if (index <= points) {
            const hue = ((totalSquares - index) / totalSquares) * 120;
            return `hsl(${hue}, 100%, 50%)`;
        }
        return 'lightgrey';
    };

    return (
        <div className="d-flex align-items-center">
            {Array.from({ length: totalSquares }, (_, i) => (
                <div key={i} style={{
                    width: `${width}px`,
                    height: `${height}px`,
                    backgroundColor: getColor(i + 1),
                    border: '1px solid #333',
                }} />
            ))}
        </div>
    );
};

export default ProblemDifficultyBar;