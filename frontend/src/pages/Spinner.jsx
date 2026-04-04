const Spinner = () => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px"
        }}>
            <div style={{
                width: "40px",
                height: "40px",
                border: "5px solid #334155",
                borderTop: "5px solid #38bdf8",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
            }} />
        </div>
    );
};

export default Spinner;