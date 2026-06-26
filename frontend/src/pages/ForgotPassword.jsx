import { useState } from "react";
import { forgotPassword } from "../services/authService";

const ForgotPassword = ({ goToResetPassword }) => {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await forgotPassword(email);

            localStorage.setItem(
                "resetEmail",
                email
            );

            alert("OTP sent to your email");

            goToResetPassword();

        } catch (err) {

            alert(
                err.response?.data ||
                "Failed to send OTP"
            );
        }
    };

    return (

        <div className="app-container">

            <div style={wrapper}>

                {/* LEFT SECTION */}

                <div style={leftSection}>

                    <h1 style={logo}>
                        TechBlog
                    </h1>

                    <h2 style={heading}>
                        Forgot Password?
                    </h2>

                    <p style={description}>
                        Enter your registered email address.
                        We'll send a verification OTP to reset
                        your password securely.
                    </p>

                </div>

                {/* RIGHT SECTION */}

                <div className="card" style={cardStyle}>

                    <h2 style={title}>
                        Forgot Password
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="input"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                        />

                        <button className="btn">
                            Send OTP
                        </button>

                    </form>

                </div>

            </div>

        </div>

    );
};

export default ForgotPassword;


/* ================= STYLES ================= */

const wrapper = {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "40px",
    flexWrap: "wrap",
    padding: "20px",
    boxSizing: "border-box"
};

const leftSection = {
    flex: 1,
    minWidth: "260px",
    color: "white"
};

const logo = {
    fontSize: "clamp(30px,5vw,42px)",
    fontWeight: "700",
    marginBottom: "20px",
    background: "linear-gradient(to right,#38bdf8,#2563eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
};

const heading = {
    fontSize: "clamp(26px,4vw,36px)",
    marginBottom: "15px"
};

const description = {
    fontSize: "clamp(14px,2vw,18px)",
    lineHeight: "1.8",
    color: "rgba(255,255,255,.75)",
    maxWidth: "500px"
};

const cardStyle = {
    flex: 1,
    width: "100%",
    minWidth: "280px",
    maxWidth: "430px",
    boxSizing: "border-box"
};

const title = {
    fontSize: "clamp(24px,4vw,30px)",
    textAlign: "center",
    marginBottom: "25px"
};