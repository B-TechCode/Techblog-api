import { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = ({ goToDashboard }) => {

    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [editPost, setEditPost] = useState(null);
    const [editFile, setEditFile] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get("/users/test", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(res.data);

            const postRes = await API.get("/posts/my", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(postRes.data.reverse());

        } catch (err) {
            console.error("PROFILE ERROR:", err);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await API.delete(`/posts/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setPosts(prev => prev.filter(p => p.id !== id));

        } catch (err) {
            console.error("DELETE ERROR:", err);
        }
    };

    const handleUpdate = async () => {
        try {
            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", editPost.title);
            formData.append("content", editPost.content);

            if (editFile) {
                formData.append("file", editFile);
            }

            await API.put(`/posts/${editPost.id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            await fetchProfile();

            setEditPost(null);
            setEditFile(null);

        } catch (err) {
            console.error("UPDATE ERROR:", err);
        }
    };

    return (
        <div style={mainStyle}>

            {/* NAVBAR */}
            <div style={navStyle}>
                <h2>My Profile</h2>
                <button onClick={goToDashboard} style={backBtn}>Back</button>
            </div>

            <div style={{ padding: "25px" }}>
                <h3>Welcome back!</h3>

                <h3 style={{ marginTop: "20px" }}>My Posts</h3>

                {posts.length === 0 ? (
                    <p>No posts yet</p>
                ) : (
                    <div style={gridStyle}>
                        {posts.map(post => (
                            <div
                                key={post.id}
                                style={cardStyle}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = "scale(1.05)";
                                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.8)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = "scale(1)";
                                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.5)";
                                }}
                            >

                                <h3>{post.title}</h3>
                                <p>{post.content}</p>

                                {post.image && (
                                    <img
                                        src={`http://localhost:8080/uploads/${post.image}`}
                                        alt="post"
                                        style={imgStyle}
                                    />
                                )}

                                <div style={{ marginTop: "12px" }}>
                                    <button
                                        style={editBtn}
                                        onClick={() => setEditPost(post)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        style={deleteBtn}
                                        onClick={() => handleDelete(post.id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* EDIT MODAL */}
            {editPost && (
                <div style={modalBg}>
                    <div style={modalBox}>

                        <h3>Edit Post</h3>

                        <input
                            placeholder="Enter title..."
                            value={editPost.title}
                            onChange={(e) =>
                                setEditPost({ ...editPost, title: e.target.value })
                            }
                            style={input}
                        />

                        <textarea
                            placeholder="Enter content..."
                            value={editPost.content}
                            onChange={(e) =>
                                setEditPost({ ...editPost, content: e.target.value })
                            }
                            style={input}
                        />

                        <input
                            type="file"
                            onChange={(e) => setEditFile(e.target.files[0])}
                            style={{ marginBottom: "10px", color: "white" }}
                        />

                        <div style={{ display: "flex", gap: "10px" }}>
                            <button
                                style={saveBtn}
                                onMouseEnter={(e)=> e.target.style.opacity=0.8}
                                onMouseLeave={(e)=> e.target.style.opacity=1}
                                onClick={handleUpdate}
                            >
                                Update
                            </button>

                            <button
                                style={cancelBtn}
                                onClick={() => setEditPost(null)}
                            >
                                Cancel
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;

/* ================= STYLES ================= */

const mainStyle = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white"
};

const navStyle = {
    background: "#020617",
    padding: "12px 20px",
    display: "flex",
    justifyContent: "space-between"
};

const backBtn = {
    background: "#38bdf8",
    border: "none",
    padding: "8px 14px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
};

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
    gap: "25px",
    marginTop: "20px"
};

const cardStyle = {
    background: "#0f172a",
    padding: "20px",
    borderRadius: "14px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
    transition: "all 0.3s ease",
    cursor: "pointer"
};

const imgStyle = {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "10px",
    marginTop: "10px"
};

const editBtn = {
    background: "#f59e0b",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    marginRight: "8px",
    cursor: "pointer",
    color: "white"
};

const deleteBtn = {
    background: "#ef4444",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white"
};

const modalBg = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const modalBox = {
    background: "#020617",
    padding: "20px",
    borderRadius: "12px",
    width: "300px"
};

const input = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "6px",
    border: "none",
    background: "#1e293b",
    color: "white"
};

const saveBtn = {
    background: "#22c55e",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
};

const cancelBtn = {
    background: "#ef4444",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
};