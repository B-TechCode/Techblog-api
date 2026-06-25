import { useState, useEffect } from "react";

import Register from "./pages/Register";
import VerifyOTP from "./pages/VerifyOTP";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Posts from "./pages/Posts";
import Notifications from "./pages/Notifications";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {

    const [page, setPage] = useState("login");

    // ================= AUTO LOGIN =================

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token) {
            setPage("dashboard");
        }

    }, []);

    // ================= REGISTER =================

    if (page === "register") {

        return (
            <Register
                goToVerify={() => setPage("verify")}
                goToLogin={() => setPage("login")}
            />
        );
    }

    // ================= VERIFY OTP =================

    if (page === "verify") {

        return (
            <VerifyOTP
                goToLogin={() => setPage("login")}
            />
        );
    }

    // ================= LOGIN =================

    if (page === "login") {

        return (
            <Login
                goToDashboard={() => setPage("dashboard")}
                goToRegister={() => setPage("register")}
                goToForgotPassword={() =>
                    setPage("forgot-password")
                }
            />
        );
    }

    // ================= FORGOT PASSWORD =================

    if (page === "forgot-password") {

        return (
            <ForgotPassword
                goToResetPassword={() =>
                    setPage("reset-password")
                }
            />
        );
    }

    // ================= RESET PASSWORD =================

    if (page === "reset-password") {

        return (
            <ResetPassword
                goToLogin={() =>
                    setPage("login")
                }
            />
        );
    }

    // ================= DASHBOARD =================

    if (page === "dashboard") {

        return (
            <Dashboard
                goToLogin={() => setPage("login")}
                goToProfile={() => setPage("profile")}
                goToFeed={() => setPage("feed")}
                goToNotifications={() =>
                    setPage("notifications")
                }
            />
        );
    }

    // ================= FEED =================

    if (page === "feed") {

        return (
            <Posts
                goToDashboard={() =>
                    setPage("dashboard")
                }
                goToProfile={() =>
                    setPage("profile")
                }
            />
        );
    }

    // ================= PROFILE =================

    if (page === "profile") {

        return (
            <Profile
                goToDashboard={() =>
                    setPage("dashboard")
                }
                goToFeed={() =>
                    setPage("feed")
                }
            />
        );
    }

    // ================= NOTIFICATIONS =================

    // ================= NOTIFICATIONS =================

    if (page === "notifications") {

        return (

            <Notifications
                goToDashboard={() =>
                    setPage("dashboard")
                }
            />

        );
    }

    return null;
}

export default App;