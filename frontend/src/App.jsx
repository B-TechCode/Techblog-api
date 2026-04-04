import { useState, useEffect } from "react";

import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

function App() {

    const [page, setPage] = useState("register");

    // ✅ AUTO LOGIN
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setPage("dashboard");
        }
    }, []);

    // ✅ ROUTING SYSTEM (VERY CLEAN)
    if (page === "register") {
        return (
            <Register
                goToVerify={() => setPage("verify")}
                goToLogin={() => setPage("login")}
            />
        );
    }

    if (page === "verify") {
        return (
            <VerifyOTP goToLogin={() => setPage("login")} />
        );
    }

    if (page === "login") {
        return (
            <Login
                goToHome={() => setPage("dashboard")}
                goToRegister={() => setPage("register")}
            />
        );
    }

    if (page === "dashboard") {
        return (
            <Dashboard
                goToLogin={() => setPage("login")}
                goToProfile={() => setPage("profile")}   // 🔥 FIXED
            />
        );
    }

    if (page === "profile") {
        return (
            <Profile goToDashboard={() => setPage("dashboard")} />
        );
    }

    return null;
}

export default App;