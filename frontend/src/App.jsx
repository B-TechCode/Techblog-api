import { useState, useEffect } from "react";

import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Posts from "./pages/Posts";   // ✅ Feed Page

function App() {

    const [page, setPage] = useState("register");

    // ✅ AUTO LOGIN
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setPage("dashboard");
        }
    }, []);

    // ================= ROUTING =================

    // REGISTER
    if (page === "register") {
        return (
            <Register
                goToVerify={() => setPage("verify")}
                goToLogin={() => setPage("login")}
            />
        );
    }

    // VERIFY
    if (page === "verify") {
        return (
            <VerifyOTP goToLogin={() => setPage("login")} />
        );
    }

    // LOGIN
    if (page === "login") {
        return (
            <Login
                goToHome={() => setPage("dashboard")}
                goToRegister={() => setPage("register")}
            />
        );
    }

    // DASHBOARD (CREATE POST PAGE)
    if (page === "dashboard") {
        return (
            <Dashboard
                goToLogin={() => setPage("login")}
                goToProfile={() => setPage("profile")}
                goToFeed={() => setPage("feed")}   // ✅ redirect after post
            />
        );
    }

    // ✅ FEED PAGE (ALL POSTS PAGE)
    if (page === "feed") {
        return (
            <Posts
                goToDashboard={() => setPage("dashboard")}   // 🔙 back
                goToProfile={() => setPage("profile")}       // optional
            />
        );
    }

    // PROFILE
    if (page === "profile") {
        return (
            <Profile
                goToDashboard={() => setPage("dashboard")}
                goToFeed={() => setPage("feed")}   // optional navigation
            />
        );
    }

    return null;
}

export default App;