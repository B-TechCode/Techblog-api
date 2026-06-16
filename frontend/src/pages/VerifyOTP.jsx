import { useState, useEffect } from "react";
import { verifyOTP } from "../services/authService";

const VerifyOTP = ({ goToLogin }) => {

    const [form, setForm] = useState({
        email: "",
        otp: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    // ================= AUTO FILL EMAIL =================

    useEffect(() => {

        const savedEmail = localStorage.getItem("verifyEmail");

        if (savedEmail) {

            setForm((prev) => ({
                ...prev,
                email: savedEmail
            }));
        }

    }, []);

    // ================= HANDLE CHANGE =================

    const handleChange = (field, value) => {

        setForm({
            ...form,
            [field]: value
        });

        if (errors[field]) {

            setErrors({
                ...errors,
                [field]: ""
            });
        }
    };

    // ================= SUBMIT =================

    const handleSubmit = async (e) => {

        e.preventDefault();

        let newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!form.otp.trim()) {
            newErrors.otp = "OTP is required";
        }

        if (form.otp && form.otp.length !== 6) {
            newErrors.otp = "OTP must be 6 digits";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {

            setLoading(true);

            const data = await verifyOTP(form);

            setSuccess(
                typeof data === "string"
                    ? data
                    : "OTP Verified Successfully "
            );

            localStorage.removeItem("verifyEmail");

            setTimeout(() => {
                goToLogin();
            }, 1200);

        } catch (err) {

            console.error(
                err.response?.data || err.message
            );

            setSuccess("");

            setErrors({
                otp: err.response?.data || "Invalid OTP"
            });

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="app-container">

            <div style={wrapper}>

                {/* ================= LEFT ================= */}

                <div style={leftSection}>

                    <h1 style={logo}>
                        TechBlog
                    </h1>

                    <h2 style={heading}>
                        Verify Your OTP
                    </h2>

                    <p style={description}>
                        We sent a verification code to your
                        email address. Enter the 6-digit OTP
                        below to activate your account.
                    </p>

                </div>

                {/* ================= RIGHT ================= */}

                <div className="card" style={cardStyle}>

                    <h2 style={title}>
                        OTP Verification
                    </h2>

                    {/* ================= SUCCESS ================= */}

                    {success && (

                        <div style={successStyle}>
                            {success}
                        </div>

                    )}

                    <form onSubmit={handleSubmit}>

                        {/* ================= EMAIL ================= */}

                        <input
                            type="email"
                            className="input"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={(e) =>
                                handleChange(
                                    "email",
                                    e.target.value
                                )
                            }
                        />

                        {errors.email && (
                            <p style={errorStyle}>
                                {errors.email}
                            </p>
                        )}

                        {/* ================= OTP ================= */}

                        <input
                            type="text"
                            className="input"
                            placeholder="Enter 6-digit OTP"
                            value={form.otp}
                            maxLength={6}
                            onChange={(e) =>
                                handleChange(
                                    "otp",
                                    e.target.value
                                )
                            }
                            style={otpInput}
                        />

                        {errors.otp && (
                            <p style={errorStyle}>
                                {errors.otp}
                            </p>
                        )}

                        {/* ================= BUTTON ================= */}

                        <button
                            className="btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Verifying..."
                                : "Verify OTP"}
                        </button>

                    </form>

                    {/* ================= LOGIN LINK ================= */}

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

export default VerifyOTP;


/* ================= STYLES ================= */

const wrapper = {
    width: "100%",
    maxWidth: "1200px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "60px",
    flexWrap: "wrap",
    padding: "20px"
};

const leftSection = {
    flex: 1,
    minWidth: "300px",
    color: "white"
};

const logo = {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "20px",
    background: "linear-gradient(to right, #38bdf8, #2563eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
};

const heading = {
    fontSize: "32px",
    marginBottom: "15px",
    lineHeight: "1.2"
};

const description = {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "rgba(255,255,255,0.75)",
    maxWidth: "500px"
};

const cardStyle = {
    flex: 1,
    minWidth: "320px",
    maxWidth: "430px"
};

const title = {
    marginBottom: "25px",
    fontSize: "30px"
};

const otpInput = {
    letterSpacing: "3px",
    textAlign: "center",
    fontSize: "18px",
    fontWeight: "400"
};

const bottomText = {
    marginTop: "18px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.75)"
};

const errorStyle = {
    color: "#f87171",
    fontSize: "13px",
    marginBottom: "10px",
    textAlign: "left"
};

const successStyle = {
    background: "rgba(34,197,94,0.18)",
    border: "1px solid #22c55e",
    color: "#22c55e",
    padding: "12px",
    borderRadius: "12px",
    marginBottom: "20px",
    textAlign: "center"
};