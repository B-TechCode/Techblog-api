import { useEffect, useState } from "react";
import API from "../api/axios";
import Spinner from "./Spinner";

const Posts = ({ reload }) => {

    const [posts, setPosts] = useState([]);
    const [likes, setLikes] = useState({});
    const [comments, setComments] = useState({});
    const [commentInput, setCommentInput] = useState({});
    const [loading, setLoading] = useState(false);

    // 🔥 EDIT STATES
    const [editingPost, setEditingPost] = useState(null);
    const [editData, setEditData] = useState({ title: "", content: "" });

    const userEmail = localStorage.getItem("userEmail");

    useEffect(() => {
        fetchPosts();
    }, [reload]);

    const fetchPosts = async () => {
        try {
            setLoading(true);

            const res = await API.get("/posts");
            setPosts(res.data);

            res.data.forEach(post => {
                fetchLikes(post.id);
                fetchComments(post.id);
            });

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchLikes = async (postId) => {
        const res = await API.get(`/likes/${postId}`);
        setLikes(prev => ({ ...prev, [postId]: res.data }));
    };

    const handleLike = async (postId) => {
        const token = localStorage.getItem("token");

        await API.post(`/likes/${postId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        fetchLikes(postId);
    };

    const fetchComments = async (postId) => {
        const res = await API.get(`/comments/${postId}`);
        setComments(prev => ({
            ...prev,
            [postId]: res.data
        }));
    };

    const handleAddComment = async (postId) => {
        const token = localStorage.getItem("token");

        if (!commentInput[postId]) return;

        await API.post(`/comments/${postId}`, {
            content: commentInput[postId]
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setCommentInput(prev => ({ ...prev, [postId]: "" }));
        fetchComments(postId);
    };

    // 🔥 DELETE COMMENT (ADDED)
    const handleDeleteComment = async (commentId, postId) => {
        try {
            const token = localStorage.getItem("token");

            await API.delete(`/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchComments(postId);

        } catch (err) {
            console.error(err);
        }
    };

    // 🔥 DELETE POST
    const handleDeletePost = async (postId) => {
        try {
            const token = localStorage.getItem("token");

            await API.delete(`/posts/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchPosts();

        } catch (err) {
            console.error(err);
        }
    };

    // 🔥 EDIT
    const handleEditClick = (post) => {
        setEditingPost(post.id);
        setEditData({
            title: post.title,
            content: post.content
        });
    };

    const handleUpdatePost = async () => {
        try {
            const token = localStorage.getItem("token");

            await API.put(`/posts/${editingPost}`, editData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setEditingPost(null);
            fetchPosts();

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{
            width: "100%",
            maxWidth: "600px",
            margin: "auto"
        }}>

            {loading && <Spinner />}

            {!loading && posts.map(post => {
                const isOwner = post.user?.email === userEmail;

                return (
                    <div key={post.id} style={{
                        background: "#1e293b",
                        color: "white",
                        borderRadius: "12px",
                        marginBottom: "20px",
                        padding: "15px"
                    }}>

                        {/* EDIT MODE */}
                        {editingPost === post.id ? (
                            <>
                                <input
                                    style={inputStyle}
                                    value={editData.title}
                                    onChange={(e)=>setEditData({
                                        ...editData,
                                        title: e.target.value
                                    })}
                                />

                                <textarea
                                    style={{ ...inputStyle, marginTop: "10px" }}
                                    value={editData.content}
                                    onChange={(e)=>setEditData({
                                        ...editData,
                                        content: e.target.value
                                    })}
                                />

                                <div style={{ marginTop: "10px" }}>
                                    <button style={commentBtn} onClick={handleUpdatePost}>
                                        Update
                                    </button>

                                    <button
                                        style={{ ...deleteBtn, marginLeft: "10px" }}
                                        onClick={() => setEditingPost(null)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>
                            </>
                        )}

                        <small style={{ opacity: 0.7 }}>
                            👤 {post.user?.email}
                        </small>

                        <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
                            <button
                                style={likeBtn}
                                onClick={(e)=>{
                                    e.target.style.transform="scale(1.2)";
                                    setTimeout(()=>e.target.style.transform="scale(1)",150);
                                    handleLike(post.id);
                                }}
                            >
                                ❤️ {likes[post.id] || 0}
                            </button>

                            {isOwner && (
                                <>
                                    <button
                                        style={editBtn}
                                        onClick={() => handleEditClick(post)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        style={deleteBtn}
                                        onClick={() => handleDeletePost(post.id)}
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>

                        {/* COMMENTS */}
                        <div style={{
                            marginTop: "15px",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "10px"
                        }}>
                            <input
                                placeholder="Add a comment..."
                                style={inputStyle}
                                value={commentInput[post.id] || ""}
                                onChange={(e)=>setCommentInput({
                                    ...commentInput,
                                    [post.id]: e.target.value
                                })}
                            />

                            <button
                                style={commentBtn}
                                onClick={()=>handleAddComment(post.id)}
                            >
                                Post
                            </button>
                        </div>

                        {/* 🔥 UPDATED COMMENT SECTION */}
                        <div style={{ marginTop: "10px" }}>
                            {(comments[post.id] || []).map((c, i) => {
                                const isCommentOwner = c.user?.email === userEmail;

                                return (
                                    <div key={i} style={commentBox}>
                                        <b>{c.user?.email}</b>: {c.content}

                                        {isCommentOwner && (
                                            <button
                                                style={{
                                                    marginLeft: "10px",
                                                    background: "transparent",
                                                    color: "#ef4444",
                                                    border: "none",
                                                    cursor: "pointer"
                                                }}
                                                onClick={() => handleDeleteComment(c.id, post.id)}
                                            >
                                                ❌
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                    </div>
                );
            })}
        </div>
    );
};

// 🎨 STYLES (UNCHANGED)
const likeBtn = {
    padding: "6px 12px",
    borderRadius: "20px",
    border: "none",
    background: "#ef4444",
    color: "white",
    cursor: "pointer",
    transition: "0.2s"
};

const editBtn = {
    padding: "6px 10px",
    background: "#f59e0b",
    border: "none",
    borderRadius: "6px",
    color: "white"
};

const deleteBtn = {
    padding: "6px 10px",
    background: "#dc2626",
    border: "none",
    borderRadius: "6px",
    color: "white"
};

const inputStyle = {
    flex: 1,
    minWidth: "200px",
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    background: "#334155",
    color: "white"
};

const commentBtn = {
    padding: "8px 12px",
    background: "#38bdf8",
    border: "none",
    borderRadius: "6px",
    color: "white"
};

const commentBox = {
    background: "#0f172a",
    padding: "6px",
    borderRadius: "6px",
    marginTop: "5px"
};

export default Posts;