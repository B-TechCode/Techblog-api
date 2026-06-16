import { useEffect, useState } from "react";
import API from "../api/axios";

const Navbar = ({ onLogout, goToProfile }) => {

    const [profilePic, setProfilePic] = useState("");
    const [userName, setUserName] = useState("");

    useEffect(() => {

        const fetchUser = async () => {

            try {

                const res = await API.get("/users/me");

                const user = res.data;

                setUserName(user.name);

                // ✅ PROFILE IMAGE FIX
                if (user.profilePic && user.profilePic !== "") {

                    setProfilePic(
                        `http://localhost:8080/uploads/${user.profilePic}`
                    );
                }

            } catch (err) {

                console.error("Navbar user fetch error:", err);
            }
        };

        fetchUser();

    }, []);

    return (

        <div style={navStyle}>

            {/* LEFT */}

            <h2 style={logoStyle}>
                TechBlog
            </h2>

            {/* RIGHT */}

            <div style={rightSection}>

                {/* USER NAME */}

                <span style={nameStyle}>
                    {userName}
                </span>

                {/* PROFILE IMAGE */}

                <img
                    src={
                        profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="profile"
                    onClick={goToProfile}
                    onError={(e) => {
                        e.target.src =
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                    style={profileStyle}
                />

                <button
                    onClick={() => window.location.href = "/notifications"}
                    style={notificationBtn}
                >
                    🔔 Notifications
                </button>

                {/* LOGOUT */}

                <button
                    onClick={onLogout}
                    style={logoutBtn}
                >
                    Logout
                </button>

            </div>

        </div>
    );
};

/* ================= STYLES ================= */

const navStyle = {

    width: "100%",
    height: "60px",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    padding: "0 20px",

    background: "rgba(2,6,23,0.95)",

    backdropFilter: "blur(10px)",

    borderBottom: "1px solid rgba(255,255,255,0.08)",

    position: "sticky",
    top: 0,
    zIndex: 999,

    boxSizing: "border-box"
};

const logoStyle = {

    margin: 0,

    fontSize: "18px",

    fontWeight: "700",

    color: "#38bdf8"
};

const rightSection = {

    display: "flex",

    alignItems: "center",

    gap: "12px"
};

const nameStyle = {

    fontSize: "13px",

    fontWeight: "600",

    color: "white"
};

const profileStyle = {

    width: "38px",

    height: "38px",

    borderRadius: "50%",

    objectFit: "cover",

    cursor: "pointer",

    border: "2px solid #38bdf8",

    transition: "0.3s"
};

const notificationBtn = {

    padding: "8px 14px",

    background:
        "linear-gradient(135deg, #3b82f6, #2563eb)",

    color: "white",

    border: "none",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "12px"
};

const logoutBtn = {

    padding: "8px 14px",

    background:
        "linear-gradient(135deg, #ef4444, #dc2626)",

    color: "white",

    border: "none",

    borderRadius: "8px",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "12px"
};

export default Navbar;