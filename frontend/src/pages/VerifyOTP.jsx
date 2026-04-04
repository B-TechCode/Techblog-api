import { useState } from "react";
import { verifyOTP } from "../services/authService";

const VerifyOTP = ({ goToLogin }) => {

    const [form, setForm] = useState({
        email: "",
        otp: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // 🔥 HANDLE CHANGE (CLEAR ERROR LIVE)
    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });

        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};

        // ✅ VALIDATION
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.otp.trim()) newErrors.otp = "OTP is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email && !emailRegex.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (form.otp && form.otp.length !== 6) {
            newErrors.otp = "OTP must be 6 digits";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);

            const res = await verifyOTP(form);

            alert("OTP Verified! Now Login");
            console.log(res.data);

            goToLogin();

        } catch (err) {
            console.error(err.response?.data || err.message);
            alert("Invalid OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">

            <div className="card">

                <h2 style={{ marginBottom: "15px" }}>Verify OTP</h2>

                <form onSubmit={handleSubmit}>

                    {/* EMAIL */}
                    <input
                        type="email"
                        className="input"
                        placeholder="Email Address"
                        value={form.email}
                        autoComplete="off"
                        onChange={(e)=>handleChange("email", e.target.value)}
                    />
                    {errors.email && <p style={{color:"red",fontSize:"12px"}}>{errors.email}</p>}

                    {/* OTP */}
                    <input
                        type="text"
                        className="input"
                        placeholder="Enter 6-digit OTP"
                        value={form.otp}
                        maxLength={6}
                        autoComplete="off"
                        onChange={(e)=>handleChange("otp", e.target.value)}
                    />
                    {errors.otp && <p style={{color:"red",fontSize:"12px"}}>{errors.otp}</p>}

                    {/* BUTTON */}
                    <button className="btn" disabled={loading}>
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                </form>

                {/* LOGIN LINK */}
                <p style={{ marginTop: "15px", fontSize: "14px" }}>
                    Back to{" "}
                    <span className="link" onClick={goToLogin}>
                        Login
                    </span>
                </p>

            </div>
        </div>
    );
};

export default VerifyOTP;