const Spinner = () => {

    return (

        <div style={overlay}>

            <div style={spinnerBox}>

                <div style={spinner}></div>

                <p style={text}>
                    Loading...
                </p>

            </div>

            {/* ================= ANIMATION ================= */}

            <style>
                {`
                    @keyframes spin {
                        0% {
                            transform: rotate(0deg);
                        }

                        100% {
                            transform: rotate(360deg);
                        }
                    }

                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                        }

                        to {
                            opacity: 1;
                        }
                    }
                `}
            </style>

        </div>
    );
};

export default Spinner;


/* ================= STYLES ================= */

const overlay = {
    position: "fixed",
    inset: 0,
    background: "rgba(2,6,23,0.75)",
    backdropFilter: "blur(8px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    animation: "fadeIn 0.3s ease"
};

const spinnerBox = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "18px"
};

const spinner = {
    width: "65px",
    height: "65px",
    border: "6px solid rgba(255,255,255,0.15)",
    borderTop: "6px solid #38bdf8",
    borderRadius: "50%",
    animation: "spin 0.9s linear infinite",
    boxShadow: "0 0 20px rgba(56,189,248,0.35)"
};

const text = {
    color: "white",
    fontSize: "16px",
    letterSpacing: "1px",
    fontWeight: "500"
};