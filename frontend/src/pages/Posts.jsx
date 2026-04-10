import { useEffect, useState } from "react";
import API from "../api/axios";

const Posts = ({ goToDashboard }) => {

    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [commentInput, setCommentInput] = useState({});

    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const res = await API.get("/posts");
            const data = res.data.reverse();
            setPosts(data);

            data.forEach(p => fetchComments(p.id));

        } catch (err) {
            console.error(err);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const res = await API.get(`/comments/${postId}`);

            setComments(prev => ({
                ...prev,
                [postId]: res.data
            }));

        } catch (err) {
            console.error(err);
        }
    };

    const handleAddComment = async (postId) => {
        const content = (commentInput[postId] || "").trim();
        if (!content) return;

        try {
            const token = localStorage.getItem("token");

            await API.post(`/comments/${postId}`, { content }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            fetchComments(postId);

            setCommentInput(prev => ({
                ...prev,
                [postId]: ""
            }));

        } catch (err) {
            alert("Comment failed");
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
            console.error(err);
        }
    };

    return (
        <div style={main}>

            {/* NAVBAR */}
            <div style={nav}>
                <h2>🔥 Feed</h2>
                <button onClick={goToDashboard} style={backBtn}>Back</button>
            </div>

            {/* GRID */}
            <div style={feed}>
                {posts.map(post => (

                    <div
                        key={post.id}
                        style={card}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "scale(1.05)";
                            e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.5)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "scale(1)";
                            e.currentTarget.style.boxShadow = "none";
                        }}
                    >

                        {/* PROFILE + NAME */}
                        <div style={topRow}>
                            <img
                                src={
                                    post.user?.profile_pic
                                        ? `http://localhost:8080/uploads/${post.user.profile_pic}`
                                        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                }
                                style={avatar}
                                alt=""
                            />
                            <p style={username}>{post.user?.name || "User"}</p>
                        </div>

                        {/* TITLE */}
                        <h3 style={title}>{post.title}</h3>

                        {/* CONTENT */}
                        <p style={content}>{post.content}</p>

                        {/* IMAGE */}
                        {post.image && (
                            <img
                                src={`http://localhost:8080/uploads/${post.image}`}
                                style={postImg}
                                onError={(e) => e.target.style.display = "none"}
                                alt=""
                            />
                        )}

                        {/* DELETE BUTTON */}
                        {post.user?.email === userEmail && (
                            <button
                                onClick={() => handleDelete(post.id)}
                                style={deleteBtn}
                            >
                                🗑 Delete
                            </button>
                        )}

                        {/* COMMENTS */}
                        <div>
                            {comments[post.id]?.map(c => (
                                <div key={c.id} style={comment}>
                                    💬 {c.content}
                                </div>
                            ))}
                        </div>

                        {/* COMMENT INPUT */}
                        <div style={inputBox}>
                            <input
                                value={commentInput[post.id] || ""}
                                onChange={(e) =>
                                    setCommentInput({
                                        ...commentInput,
                                        [post.id]: e.target.value
                                    })
                                }
                                placeholder="Add comment..."
                                style={input}
                            />

                            <button
                                onClick={() => handleAddComment(post.id)}
                                style={postBtn}
                            >
                                Post
                            </button>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default Posts;


/* 🎨 STYLES */

const main = {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)"
};

const nav = {
    display: "flex",
    justifyContent: "space-between",
    padding: "15px 20px",
    background: "#020617",
    color: "white"
};

const backBtn = {
    background: "#00c6ff",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
};

const feed = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    padding: "20px"
};

const card = {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "12px",
    color: "white",
    transition: "0.3s"
};

const topRow = {
    display: "flex",
    alignItems: "center",
    gap: "10px"
};

const avatar = {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    objectFit: "cover"
};

const username = {
    fontWeight: "bold"
};

const title = {
    textAlign: "center",
    marginTop: "10px"
};

const content = {
    textAlign: "center"
};

const postImg = {
    width: "100%",
    marginTop: "10px",
    borderRadius: "8px"
};

const deleteBtn = {
    marginTop: "10px",
    background: "#ef4444",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer"
};

const comment = {
    background: "#334155",
    padding: "6px",
    marginTop: "5px",
    borderRadius: "6px"
};

const inputBox = {
    display: "flex",
    marginTop: "10px"
};

const input = {
    flex: 1,
    padding: "6px",
    borderRadius: "6px",
    border: "none",
    color: "black",
    background: "white"
};

const postBtn = {
    marginLeft: "5px",
    background: "#00c6ff",
    border: "none",
    padding: "6px",
    borderRadius: "6px",
    cursor: "pointer"
};