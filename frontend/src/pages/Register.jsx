import { useState } from "react";
import { registerUser } from "../services/authService";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = ({ goToVerify, goToLogin }) => {

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        gender: ""
    });

    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [success, setSuccess] = useState("");   // 🔥 NEW

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};

        if (!form.name.trim()) newErrors.name = "Name is required";
        if (!form.email.trim()) newErrors.email = "Email is required";
        if (!form.password.trim()) newErrors.password = "Password is required";
        if (!form.gender) newErrors.gender = "Gender is required";

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (form.email && !emailRegex.test(form.email)) {
            newErrors.email = "Invalid email format";
        }

        if (form.password && form.password.length < 6) {
            newErrors.password = "Min 6 characters required";
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            const res = await registerUser(form);

            // ❌ remove alert
            // alert("Registered! Check OTP");

            // ✅ SHOW SUCCESS UI
            setSuccess("Registered successfully! Please verify OTP.");

            console.log(res.data);

            // 🔥 small delay for UX
            setTimeout(() => {
                goToVerify();
            }, 1500);

        } catch (err) {
            console.error(err.response?.data || err.message);
            setSuccess(""); // clear success
            alert(err.response?.data?.message || "Registration Failed");
        }
    };

    const handleChange = (field, value) => {
        setForm({ ...form, [field]: value });

        if (errors[field]) {
            setErrors({ ...errors, [field]: "" });
        }
    };

    return (
        <div className="app-container">

            <div className="card">

                <h2 style={{ marginBottom: "15px" }}>Create Account</h2>

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

                    {/* NAME */}
                    <input
                        className="input"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={(e)=>handleChange("name", e.target.value)}
                    />
                    {errors.name && <p style={{color:"#ff6b6b",fontSize:"12px"}}>{errors.name}</p>}

                    {/* EMAIL */}
                    <input
                        className="input"
                        placeholder="Email Address"
                        value={form.email}
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
                            onChange={(e)=>handleChange("password", e.target.value)}
                        />

                        <span
                            onClick={() => setShowPassword(!showPassword)}
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

                    {/* GENDER */}
                    <select
                        className="input"
                        value={form.gender}
                        onChange={(e)=>handleChange("gender", e.target.value)}
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.gender && <p style={{color:"#ff6b6b",fontSize:"12px"}}>{errors.gender}</p>}

                    <button className="btn">
                        Register
                    </button>

                </form>

                <p style={{ marginTop: "15px", fontSize: "14px" }}>
                    Already have an account?{" "}
                    <span className="link" onClick={goToLogin}>
                        Sign In
                    </span>
                </p>

            </div>
        </div>
    );
};

export default Register;