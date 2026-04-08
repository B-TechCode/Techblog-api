import { useState } from "react";
import { loginUser } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = ({ goToHome, goToRegister }) => {

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState(""); // 🔥 NEW

    // 🔥 HANDLE CHANGE
    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });

        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};

        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.password.trim()) newErrors.password = "Password is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email && !emailRegex.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);

            const res = await loginUser(form);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("userEmail", form.email);

            // ❌ REMOVE alert
            // alert("Login Successful!");

            // ✅ SHOW SUCCESS MESSAGE
            setSuccess("Login successful!");
            localStorage.setItem("userEmail", res.data.email);

            // 🔥 DELAY FOR UX
            setTimeout(() => {
                goToHome();
            }, 1200);

        } catch (err) {
            console.error(err.response?.data || err.message);
            setSuccess("");
            alert("Invalid Credentials or Not Verified");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">

            <div className="card">

                <h2 style={{ marginBottom: "15px" }}>Welcome Back</h2>

                {/* 🔥 SUCCESS MESSAGE */}
                {success && (
                    <p style={{
                        background: "#28a745",
                        color: "white",
                        padding: "10px",
                        borderRadius: "6px",
                        marginBottom: "10px",
                        fontSize: "14px"
                    }}>
                        {success}
                    </p>
                )}

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
                    {errors.email && <p style={{color:"#ff6b6b",fontSize:"12px"}}>{errors.email}</p>}

                    {/* PASSWORD */}
                    <div style={{ position: "relative" }}>
                        <input
                            type={showPassword ? "text" : "password"}
                            className="input"
                            placeholder="Password"
                            value={form.password}
                            autoComplete="off"
                            onChange={(e)=>handleChange("password", e.target.value)}
                        />

                        <span
                            onClick={()=>setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "50%",
                                transform: "translateY(-50%)",
                                cursor: "pointer",
                                color: "#333",   // 🔥 FIXED VISIBILITY
                                fontSize: "16px"
                            }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {errors.password && <p style={{color:"#ff6b6b",fontSize:"12px"}}>{errors.password}</p>}

                    {/* BUTTON */}
                    <button className="btn" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* REGISTER LINK */}
                <p style={{ marginTop: "15px", fontSize: "14px" }}>
                    Don't have an account?{" "}
                    <span className="link" onClick={goToRegister}>
                        Register
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Login;