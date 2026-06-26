import { useEffect, useState } from "react";
import API from "../api/axios";
import Upload from "./Upload";
import CreatePost from "./CreatePost";
import SearchUsers from "../components/SearchUsers";
import { getNotifications } from "../services/notificationService";
// import SearchUsers component using existing structure only
import {
    connectNotifications,
    disconnectNotifications
} from "../services/websocketService";
const Dashboard = ({
                       goToLogin,
                       goToProfile,
                       goToFeed,
                       goToNotifications
                   }) => {

    const [user, setUser] = useState(null);
    const [profilePic, setProfilePic] = useState("");
    const [notificationCount, setNotificationCount] = useState(0);

    useEffect(() => {

        fetchUser();

        const interval = setInterval(() => {
            fetchNotificationsCount();
        }, 5000);

        return () => {
            clearInterval(interval);
        };

    }, []);


// ================= FETCH USER =================

    const fetchUser = async () => {

        try {

            const res = await API.get("/users/me");

            const userData = res.data;

            console.log("Current User:", userData);

            setUser(userData);

            // CONNECT WEBSOCKET ONLY ONCE

            connectNotifications(
                userData.id,
                (message) => {

                    console.log(
                        "Notification received:",
                        message
                    );

                    setNotificationCount(
                        (prev) => prev + 1
                    );

                    alert(message);
                }
            );

            await fetchNotificationsCount();

            if (userData.profilePic) {

                setProfilePic(
                    `http://localhost:8080/uploads/${userData.profilePic}`
                );

            } else {

                setProfilePic("");
            }

        } catch (err) {

            console.error("User fetch failed:", err);

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            goToLogin();
        }
    };



// ================= FETCH NOTIFICATION COUNT =================

    const fetchNotificationsCount = async () => {

        try {

            const notifications = await getNotifications();

            setNotificationCount(notifications.length);

        } catch (err) {

            console.error(
                "Failed to fetch notification count:",
                err
            );
        }
    };




    // ================= LOGOUT =================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        goToLogin();
    };

    return (

        <div style={container}>

            {/* ================= NAVBAR ================= */}

            <div style={navbar}>

                <h1 style={logo}>
                    TechBlog
                </h1>

                <div style={navRight}>

                    {/* FEED BUTTON */}

                    <button
                        onClick={goToFeed}
                        style={feedBtn}
                    >
                        Feed
                    </button>

                    <div
                        style={notificationContainer}
                        onClick={goToNotifications}
                    >

                   <span style={bellIcon}>
        🔔
                        </span>

                              {notificationCount > 0 && (

                            <span  style={notificationBadge}>
                           {notificationCount}
                       </span>

                        )}
                    </div>

                    {/* SEARCH USERS */}

                    <SearchUsers />

                    {/* PROFILE IMAGE */}

                    <img
                        src={
                            profilePic ||
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt="profile"
                        onClick={goToProfile}
                        style={navProfile}
                        onError={(e) => {

                            e.target.src =
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                    />

                    {/* LOGOUT */}

                    <button
                        onClick={handleLogout}
                        style={logoutBtn}
                    >
                        Logout
                    </button>

                </div>

            </div>

            {/* ================= MAIN ================= */}

            <div style={main}>

                {/* ================= PROFILE SECTION ================= */}

                <div style={profileSection}>

                    <div style={profileCard}>

                        {/* PROFILE IMAGE */}

                        <img
                            src={
                                profilePic ||
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt="profile"
                            style={profileImg}
                            onError={(e) => {

                                e.target.src =
                                    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                            }}
                        />

                        {/* WELCOME */}

                        <h2 style={welcomeText}>
                            Welcome {user?.name || "User"}
                        </h2>

                        {/* UPLOAD */}

                        <div style={uploadWrapper}>

                            <Upload
                                onUploadSuccess={(imgName) => {

                                    if (
                                        !imgName ||
                                        imgName === "undefined"
                                    ) return;

                                    // ✅ FIXED IMAGE URL

                                    setProfilePic(
                                        `http://localhost:8080/uploads/${imgName}`
                                    );
                                }}
                            />

                        </div>

                    </div>

                </div>

                {/* ================= CREATE POST ================= */}

                <div style={createPostSection}>

                    <div
                        style={{
                            width: "100%",
                            maxWidth: "850px"
                        }}
                    >

                        <CreatePost
                            goToFeed={goToFeed}
                        />

                    </div>

                </div>

            </div>

        </div>
    );
};

export default Dashboard;


/* ================= STYLES ================= */

const container = {

    minHeight: "100vh",

    background:
        "linear-gradient(to bottom right, #020617, #020617, #0f172a)",

    color: "white"
};

/* ================= NAVBAR ================= */

const navbar = {

    width: "95%",

    minHeight: "68px",

    margin: "16px auto 0",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "12px",

    padding: "12px 20px",

    background: "rgba(255,255,255,0.03)",

    backdropFilter: "blur(14px)",

    border: "1px solid rgba(255,255,255,0.08)",

    borderRadius: "14px",

    boxSizing: "border-box",

    position: "sticky",

    top: "16px",

    zIndex: "100"
};

const logo = {

    fontSize: "clamp(22px, 4vw, 28px)",

    fontWeight: "700",

    margin: 0,

    letterSpacing: "0.5px",

    background:
        "linear-gradient(to right,#38bdf8,#2563eb)",

    WebkitBackgroundClip: "text",

    WebkitTextFillColor: "transparent"
};

const navRight = {

    display: "flex",

    alignItems: "center",

    justifyContent: "center",

    flexWrap: "wrap",

    gap: "12px"
};

const feedBtn = {

    minWidth: "75px",

    height: "38px",

    padding: "0 14px",

    borderRadius: "8px",

    border: "none",

    background:
        "linear-gradient(135deg,#2563eb,#38bdf8)",

    color: "white",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "13px",

    whiteSpace: "nowrap"
};

const navProfile = {

    width: "40px",

    height: "40px",

    minWidth: "40px",

    borderRadius: "50%",

    objectFit: "cover",

    border: "2px solid #38bdf8",

    cursor: "pointer",

    flexShrink: 0
};


const notificationContainer = {

    position: "relative",

    width: "38px",

    height: "38px",

    minWidth: "38px",

    borderRadius: "50%",

    background:
        "linear-gradient(135deg,#2563eb,#38bdf8)",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    cursor: "pointer",

    flexShrink: 0
};

const bellIcon = {

    color: "white",

    fontSize: "18px"
};

const notificationBadge = {

    position: "absolute",

    top: "-4px",

    right: "-4px",

    width: "18px",

    height: "18px",

    borderRadius: "50%",

    background: "#ef4444",

    color: "white",

    fontSize: "11px",

    fontWeight: "700",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    border: "2px solid #111827"
};



const logoutBtn = {

    minWidth: "82px",

    height: "38px",

    padding: "0 14px",

    borderRadius: "8px",

    border: "none",

    background:
        "linear-gradient(135deg,#ef4444,#dc2626)",

    color: "white",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "13px",

    whiteSpace: "nowrap"
};

/* ================= MAIN ================= */

const main = {

    width: "100%",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    padding: "30px 16px",

    gap: "24px",

    boxSizing: "border-box"
};

/* ================= PROFILE SECTION ================= */

const profileSection = {

    width: "100%",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: "0 16px"
};

const profileCard = {

    width: "100%",

    maxWidth: "340px",

    minWidth: "260px",

    padding: "16px",

    borderRadius: "18px",

    background: "rgba(255,255,255,0.07)",

    backdropFilter: "blur(14px)",

    border: "1px solid rgba(255,255,255,0.08)",

    textAlign: "center",

    boxShadow: "0 8px 40px rgba(0,0,0,0.35)",

    boxSizing: "border-box"
};


const profileImg = {

    width: "clamp(70px,18vw,82px)",

    height: "clamp(70px,18vw,82px)",

    borderRadius: "50%",

    objectFit: "cover",

    border: "4px solid rgba(255,255,255,0.12)",

    marginBottom: "8px"
};

const welcomeText = {

    fontSize: "clamp(16px,3vw,20px)",

    fontWeight: "700",

    marginBottom: "8px",

    wordBreak: "break-word"
};

const uploadWrapper = {

    marginTop: "8px"
};

/* ================= CREATE POST ================= */

const createPostSection = {

    width: "100%",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: "0 16px",

    boxSizing: "border-box"
};