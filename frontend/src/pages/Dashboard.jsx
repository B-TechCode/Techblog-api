import { useEffect, useState } from "react";
import API from "../api/axios";
import Upload from "./Upload";
import CreatePost from "./CreatePost";
import Posts from "./Posts";

const Dashboard = ({ goToLogin, goToProfile }) => {

    const [userEmail, setUserEmail] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await API.get("/users/test", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setUserEmail(res.data.email);
                setProfilePic(localStorage.getItem("profilePic"));

            } catch (err) {
                localStorage.clear();
                goToLogin();
            }
        };

        fetchData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        goToLogin();
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea, #764ba2)"
        }}>

            {/* 🔥 NAVBAR */}
            <div style={{
                width: "100%",
                background: "#020617",
                color: "white",
                padding: "10px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                <h2>TechBlog</h2>

                <button
                    onClick={handleLogout}
                    style={{
                        padding: "8px 14px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Logout
                </button>
            </div>

            {/* 🔥 MAIN */}
            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "20px"   // 🔥 moved up
            }}>

                {/* 🔥 WELCOME CARD */}
                <div
                    style={{
                        width: "330px",
                        padding: "10px",
                        borderRadius: "16px",
                        background: "rgba(255,255,255,0.2)",
                        backdropFilter: "blur(10px)",
                        textAlign: "center",
                        color: "white",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                        transition: "0.3s"
                    }}
                    onMouseEnter={(e)=>{
                        e.currentTarget.style.transform="scale(1.02)";
                        e.currentTarget.style.boxShadow="0 15px 40px rgba(0,0,0,0.4)";
                    }}
                    onMouseLeave={(e)=>{
                        e.currentTarget.style.transform="scale(1)";
                        e.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,0.3)";
                    }}
                >

                    <h3 style={{ marginBottom: "8px" }}>
                        Welcome User
                    </h3>

                    <div style={{ fontSize: "35px", marginBottom: "8px" }}>
                        👤
                    </div>

                    <Upload />

                </div>

                {/* 🔥 CREATE POST */}
                <CreatePost refreshPosts={() => setReload(!reload)} />

                {/* POSTS */}
                <Posts reload={reload} />

            </div>
        </div>
    );
};

export default Dashboard;