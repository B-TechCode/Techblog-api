import { useState } from "react";
import { resetPassword } from "../services/authService";

const ResetPassword = ({ goToLogin }) => {

    const [form, setForm] = useState({
        otp: "",
        newPassword: ""
    });

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await resetPassword({
                email: localStorage.getItem("resetEmail"),
                otp: form.otp,
                newPassword: form.newPassword
            });

            localStorage.removeItem("resetEmail");

            alert("Password reset successful");

            goToLogin();

        } catch (err) {

            alert(
                err.response?.data ||
                "Password reset failed"
            );
        }
    };

    return (

        <div className="app-container">

            <div style={wrapper}>

                {/* ================= LEFT SECTION ================= */}

                <div style={leftSection}>

                    <h1 style={logo}>
                        TechBlog
                    </h1>

                    <h2 style={heading}>
                        Reset Password
                    </h2>

                    <p style={description}>
                        Enter the OTP sent to your email and choose
                        a strong new password to secure your account.
                    </p>

                </div>

                {/* ================= RIGHT SECTION ================= */}

                <div className="card" style={cardStyle}>

                    <h2 style={title}>
                        Reset Password
                    </h2>

                    <form onSubmit={handleSubmit}>

                        <input
                            type="text"
                            placeholder="Enter OTP"
                            className="input"
                            value={form.otp}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    otp: e.target.value
                                })
                            }
                        />

                        <input
                            type="password"
                            placeholder="New Password"
                            className="input"
                            value={form.newPassword}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    newPassword: e.target.value
                                })
                            }
                        />

                        <button className="btn">
                            Reset Password
                        </button>

                    </form>

                    <p style={bottomText}>

                        Back to{" "}

                        <span
                            className="link"
                            onClick={goToLogin}
                        >
                        Login
                    </span>

                    </p>

                </div>

            </div>

        </div>

    );
};

export default ResetPassword;



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

const bottomText = {
    marginTop: "20px",
    textAlign: "center",
    color: "rgba(255,255,255,.75)"
};