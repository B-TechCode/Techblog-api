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

                    <button
                        onClick={goToNotifications}
                        style={notificationBtn}
                    >
                        🔔 Notifications ({notificationCount})
                    </button>


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

                    <CreatePost
                        goToFeed={goToFeed}
                    />

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

    width: "100%",

    display: "flex",

    justifyContent: "space-between",

    alignItems: "center",

    padding: "7px 16px",

    background: "rgba(255,255,255,0.03)",

    backdropFilter: "blur(12px)",

    borderBottom:
        "1px solid rgba(255,255,255,0.06)"
};

const logo = {

    fontSize: "18px",

    fontWeight: "700",

    margin: 0,

    background:
        "linear-gradient(to right, #38bdf8, #2563eb)",

    WebkitBackgroundClip: "text",

    WebkitTextFillColor: "transparent"
};

const navRight = {

    display: "flex",

    alignItems: "center",

    gap: "12px"
};

const feedBtn = {

    padding: "7px 14px",

    borderRadius: "9px",

    border: "none",

    background:
        "linear-gradient(135deg, #2563eb, #38bdf8)",

    color: "white",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "12px"
};

const navProfile = {

    width: "34px",

    height: "34px",

    borderRadius: "50%",

    objectFit: "cover",

    border:
        "2px solid rgba(255,255,255,0.15)",

    cursor: "pointer"
};


const notificationBtn = {

    padding: "7px 13px",

    borderRadius: "9px",

    border: "none",

    background:
        "linear-gradient(135deg, #3b82f6, #2563eb)",

    color: "white",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "12px"
};
const logoutBtn = {

    padding: "7px 13px",

    borderRadius: "9px",

    border: "none",

    background:
        "linear-gradient(135deg, #ef4444, #dc2626)",

    color: "white",

    cursor: "pointer",

    fontWeight: "600",

    fontSize: "12px"
};

/* ================= MAIN ================= */

const main = {

    width: "100%",

    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    paddingTop: "28px",

    gap: "24px"
};

/* ================= PROFILE SECTION ================= */

const profileSection = {

    width: "100%",

    display: "flex",

    justifyContent: "center",

    alignItems: "center"
};

const profileCard = {

    width: "285px",

    padding: "8px",

    borderRadius: "18px",

    background: "rgba(255,255,255,0.07)",

    backdropFilter: "blur(14px)",

    border:
        "1px solid rgba(255,255,255,0.08)",

    textAlign: "center",

    boxShadow:
        "0 8px 40px rgba(0,0,0,0.35)"
};

const profileImg = {

    width: "82px",

    height: "82px",

    borderRadius: "50%",

    objectFit: "cover",

    border:
        "4px solid rgba(255,255,255,0.12)",

    marginBottom: "8px"
};

const welcomeText = {

    fontSize: "17px",

    fontWeight: "700",

    marginBottom: "8px"
};

const uploadWrapper = {

    marginTop: "8px"
};

/* ================= CREATE POST ================= */

const createPostSection = {

    width: "100%",

    display: "flex",

    justifyContent: "center",

    alignItems: "center"
};