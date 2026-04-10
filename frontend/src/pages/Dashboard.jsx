import { useEffect, useState } from "react";
import API from "../api/axios";
import Upload from "./Upload";
import CreatePost from "./CreatePost";

const Dashboard = ({ goToLogin, goToProfile, goToFeed }) => {

    const [userEmail, setUserEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get("/users/test", {
                headers: { Authorization: `Bearer ${token}` },
            });

            setUserEmail(res.data.email);

            // ✅ FIX: load image correctly
            const saved = localStorage.getItem("profileImage");

            if (saved) {
                setProfilePic(`http://localhost:8080/uploads/${saved}?t=${Date.now()}`);
            } else if (res.data.profileImage) {
                const img = res.data.profileImage;
                setProfilePic(`http://localhost:8080/uploads/${img}?t=${Date.now()}`);
                localStorage.setItem("profileImage", img);
            } else {
                setProfilePic("");
            }

        } catch (err) {
            localStorage.clear();
            goToLogin();
        }
    };

    useEffect(() => {
        const fetchNotif = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await API.get("/notifications", {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setNotifications(res.data || []);

            } catch (err) {
                console.warn("Notifications not available");
            }
        };

        fetchNotif();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        goToLogin();
    };

    return (
        <div style={container}>

            {/* 🔥 NAVBAR */}
            <div style={navbar}>
                <h2 style={{ margin: 0 }}>TechBlog</h2>

                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>

                    <img
                        src={
                            profilePic ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="profile"
                        onClick={goToProfile}
                        style={navProfile}
                    />

                    <button onClick={handleLogout} style={logoutBtn}>
                        Logout
                    </button>
                </div>
            </div>

            {/* 🔔 NOTIFICATIONS */}
            <div style={notifBox}>
                {notifications.map(n => (
                    <p key={n.id}>🔔 {n.message}</p>
                ))}
            </div>

            {/* 🔥 MAIN */}
            <div style={main}>

                {/* 🔥 WELCOME CARD */}
                <div
                    style={cardStyle}
                    onMouseEnter={(e)=>{
                        e.currentTarget.style.transform="scale(1.05)";
                    }}
                    onMouseLeave={(e)=>{
                        e.currentTarget.style.transform="scale(1)";
                    }}
                >

                    <h3 style={{ marginBottom: "8px" }}>Welcome User</h3>

                    {/* ✅ ONLY ONE PROFILE IMAGE */}
                    <img
                        src={
                            profilePic
                                ? profilePic
                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="profile"
                        style={profileImg}
                        onError={(e) => {
                            e.target.src =
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                    />

                    {/* ✅ UPLOAD (NO IMAGE INSIDE) */}
                    <Upload
                        onUploadSuccess={(imgName) => {
                            const img = `http://localhost:8080/uploads/${imgName}`;
                            setProfilePic(img + "?t=" + Date.now());
                            localStorage.setItem("profileImage", imgName);
                        }}
                    />

                </div>

                {/* CREATE POST */}
                <CreatePost goToFeed={goToFeed} />

            </div>
        </div>
    );
};

export default Dashboard;


/* 🎨 STYLES */

const container = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)"
};

const navbar = {
    width: "100%",
    background: "#020617",
    color: "white",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
};

const main = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "20px",
    gap: "20px"
};

const notifBox = {
    padding: "10px 20px",
    color: "white"
};

const navProfile = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    cursor: "pointer",
    border: "2px solid #38bdf8",
    objectFit: "cover"
};

const profileImg = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
    border: "3px solid #38bdf8"
};

const logoutBtn = {
    padding: "8px 14px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer"
};

const cardStyle = {
    width: "260px",
    padding: "15px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)",
    textAlign: "center",
    color: "white",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    transition: "0.3s"
};