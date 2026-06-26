import { useState } from "react";
import { loginUser } from "../services/authService";

const Login = ({
                   goToRegister, goToDashboard, goToForgotPassword }) => {
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

                    <p style={{ marginTop: "10px" }}>

                  <span
                  className="link"
                   onClick={goToForgotPassword}
                >
                  Forgot Password?
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
    maxWidth: "1450px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "60px",
    flexWrap: "wrap",
    padding: "20px",
    boxSizing: "border-box"
};

const leftSection = {
    flex: 1.2,
    minWidth: "280px",
    color: "white",
    paddingLeft: "10px"
};

const logo = {
    fontSize: "clamp(34px,6vw,56px)",
    fontWeight: "700",
    marginBottom: "25px",
    background: "linear-gradient(to right, #38bdf8, #2563eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent"
};

const heading = {
    fontSize: "clamp(30px,5vw,48px)",
    fontWeight: "700",
    marginBottom: "20px",
    lineHeight: "1.2"
};

const description = {
    fontSize: "clamp(16px,2vw,22px)",
    lineHeight: "1.8",
    color: "rgba(255,255,255,0.75)",
    maxWidth: "650px"
};

const cardStyle = {
    flex: 1,
    minWidth: "280px",
    width: "100%",
    maxWidth: "520px",
    padding: "30px",
    boxSizing: "border-box"
};

const title = {
    marginBottom: "30px",
    fontSize: "clamp(28px,5vw,42px)",
    fontWeight: "700",
    textAlign: "center"
};

const bottomText = {
    marginTop: "24px",
    fontSize: "15px",
    color: "rgba(255,255,255,0.75)",
    textAlign: "center"
};