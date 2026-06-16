import { useState } from "react";
import { loginUser } from "../services/authService";

const Login = ({ goToRegister, goToDashboard }) => {

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const data = await loginUser(form);

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            alert("Login successful ");

            goToDashboard();

        } catch (err) {

            console.error(err);

            alert(
                err.response?.data?.message ||
                err.response?.data ||
                "Login failed"
            );

        } finally {

            setLoading(false);
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
                        Welcome Back
                    </h2>

                    <p style={description}>
                        Login to continue sharing your ideas,
                        posts and connect with people.
                    </p>

                </div>

                {/* ================= RIGHT SECTION ================= */}

                <div className="card" style={cardStyle}>

                    <h2 style={title}>
                        Login
                    </h2>

                    <form onSubmit={handleSubmit}>

                        {/* ================= EMAIL ================= */}

                        <input
                            type="email"
                            placeholder="Email Address"
                            className="input"
                            value={form.email}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    email: e.target.value
                                })
                            }
                        />

                        {/* ================= PASSWORD ================= */}

                        <div className="password-box">

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="input password-input"
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value
                                    })
                                }
                            />

                            <span
                                className="eye-icon"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </span>

                        </div>

                        {/* ================= BUTTON ================= */}

                        <button
                            className="btn"
                            disabled={loading}
                        >
                            {loading
                                ? "Logging in..."
                                : "Login"}
                        </button>

                    </form>

                    {/* ================= REGISTER LINK ================= */}

                    <p style={bottomText}>

                        Don’t have an account?{" "}

                        <span
                            className="link"
                            onClick={goToRegister}
                        >
                            Register
                        </span>

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;


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
    fontSize: "40px",
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

const bottomText = {
    marginTop: "18px",
    fontSize: "14px",
    color: "rgba(255,255,255,0.75)"
};