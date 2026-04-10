import { useEffect, useState } from "react";
import API from "../api/axios";

const Navbar = ({ onLogout, goToProfile }) => {

    const [profilePic, setProfilePic] = useState("");

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await API.get("/users/test", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                if (res.data.profileImage) {
                    setProfilePic(`http://localhost:8080/uploads/${res.data.profileImage}`);
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
            <h2 style={{ margin: 0 }}>TechBlog</h2>

            {/* RIGHT */}
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>

                {/* 🔥 PROFILE IMAGE */}
                <img
                    src={
                        profilePic ||
                        "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    }
                    alt="profile"
                    onClick={goToProfile}
                    style={profileStyle}
                />

                {/* LOGOUT */}
                <button onClick={onLogout} style={logoutBtn}>
                    Logout
                </button>

            </div>
        </div>
    );
};

/* STYLES */

const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 25px",
    background: "#020617",
    color: "white",
    boxShadow: "0 5px 15px rgba(0,0,0,0.3)"
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

const logoutBtn = {
    padding: "8px 14px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
};

export default Navbar;