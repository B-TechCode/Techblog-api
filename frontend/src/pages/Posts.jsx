import { useEffect, useState } from "react";
import API from "../api/axios";

const Posts = ({ goToDashboard }) => {

    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState({});
    const [commentInput, setCommentInput] = useState({});
    const [likes, setLikes] = useState({});
    const [likedPosts, setLikedPosts] = useState({});

    const user = JSON.parse(localStorage.getItem("user") || "null");

    useEffect(() => {
        fetchPosts();
    }, []);

    // ================= FETCH POSTS =================

    const fetchPosts = async () => {

        try {

            const res = await API.get("/posts");

            const data = res.data.reverse();

            const validPosts = data.filter(
                (p) => p && p.id
            );

            setPosts(validPosts);

            validPosts.forEach((p) => {

                fetchComments(Number(p.id));
                fetchLikes(Number(p.id));
                checkIfLiked(Number(p.id));

            });

        } catch (err) {

            console.error("POST FETCH ERROR:", err);
        }
    };

    // ================= FETCH LIKES =================

    const fetchLikes = async (postId) => {

        if (!postId) return;

        try {

            const res = await API.get(
                `/likes/${Number(postId)}`
            );

            setLikes((prev) => ({
                ...prev,
                [postId]: res.data
            }));

        } catch (err) {

            console.error("LIKE FETCH ERROR:", err);
        }
    };

    // ================= CHECK LIKE =================

    const checkIfLiked = async (postId) => {

        if (!postId) return;

        try {

            const res = await API.get(
                `/likes/check/${Number(postId)}`
            );

            setLikedPosts((prev) => ({
                ...prev,
                [postId]: res.data
            }));

        } catch (err) {

            console.error("CHECK LIKE ERROR:", err);
        }
    };

    // ================= HANDLE LIKE =================

    const handleLike = async (postId) => {

        if (!postId) {
            alert("Invalid Post");
            return;
        }

        try {

            await API.post(
                `/likes/${Number(postId)}`
            );

            fetchLikes(Number(postId));

            checkIfLiked(Number(postId));

        } catch (err) {

            console.error("LIKE ERROR:", err);

            alert("Like failed");
        }
    };

    // ================= FETCH COMMENTS =================

    const fetchComments = async (postId) => {

        if (!postId) return;

        try {

            const res = await API.get(
                `/comments/${Number(postId)}`
            );

            setComments((prev) => ({
                ...prev,
                [postId]: res.data
            }));

        } catch (err) {

            console.error(
                "COMMENT FETCH ERROR:",
                err
            );
        }
    };

    // ================= ADD COMMENT =================


// ================= ADD COMMENT =================

    const handleAddComment = async (postId) => {

        if (!postId) {
            alert("Invalid Post");
            return;
        }

        const content =
            (commentInput[postId] || "").trim();

        if (!content) {
            alert("Write comment first");
            return;
        }

        try {

            await API.post(
                "/comments",
                {
                    content: content,
                    postId: Number(postId)
                }
            );

            // ✅ REFRESH COMMENTS

            await fetchComments(Number(postId));

            // ✅ CLEAR INPUT

            setCommentInput((prev) => ({
                ...prev,
                [postId]: ""
            }));

        } catch (err) {

            console.error("COMMENT ERROR:", err);

            alert("Comment failed");
        }
    };
    // ================= DELETE POST =================

    const handleDelete = async (id) => {

        if (!id) {
            alert("Invalid Post");
            return;
        }

        try {

            await API.delete(
                `/posts/${Number(id)}`
            );

            setPosts((prev) =>
                prev.filter((p) => p.id !== id)
            );

        } catch (err) {

            console.error("DELETE ERROR:", err);

            alert("Delete failed");
        }
    };

    return (

        <div style={container}>

            {/* ================= NAVBAR ================= */}

            <div style={navbar}>

                <h1 style={logo}>
                    TechBlog Feed
                </h1>

                <button
                    onClick={goToDashboard}
                    style={backBtn}
                >
                    Dashboard
                </button>

            </div>

            {/* ================= FEED ================= */}

            <div style={feedContainer}>

                {posts.map((post) => (

                    <div
                        key={post.id}
                        style={card}
                    >

                        {/* ================= USER ================= */}

                        <div style={topRow}>

                            <div style={userInfo}>

                                <img
                                    src={
                                        post.user?.profilePic
                                            ? `http://localhost:8080/uploads/${post.user.profilePic}`
                                            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    }
                                    onError={(e) => {
                                        e.target.src =
                                            "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                    }}
                                    style={avatar}
                                    alt=""
                                />

                                <div>

                                    <p style={username}>
                                        {post.user?.name || "User"}
                                    </p>

                                    <p style={timeText}>
                                        TechBlog User
                                    </p>

                                </div>

                            </div>

                        </div>

                        {/* ================= TITLE ================= */}

                        <h2 style={title}>
                            {post.title}
                        </h2>

                        {/* ================= CONTENT ================= */}

                        <p style={content}>
                            {post.content}
                        </p>

                        {/* ================= IMAGE ================= */}

                        {post.image &&
                            post.image !== "undefined" &&
                            post.image !== "" && (

                                <img
                                    src={`http://localhost:8080/uploads/${post.image}`}
                                    style={postImg}
                                    alt=""
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                    }}
                                />
                            )}

                        {/* ================= ACTIONS ================= */}

                        <div style={actionRow}>

                            <button
                                onClick={() =>
                                    handleLike(Number(post.id))
                                }
                                style={{
                                    ...likeBtn,
                                    background:
                                        likedPosts[post.id]
                                            ? "#ff4d6d"
                                            : "rgba(255,255,255,0.08)"
                                }}
                            >
                                ❤️ {likes[post.id] || 0}
                            </button>

                            {(user?.id === post.user?.id ||
                                user?.email === "admin@gmail.com") && (

                                <button
                                    onClick={() =>
                                        handleDelete(Number(post.id))
                                    }
                                    style={deleteBtn}
                                >
                                    Delete
                                </button>

                            )}

                        </div>

                        {/* ================= COMMENTS ================= */}

                        <div style={commentSection}>

                            {comments[post.id]?.map((c) => (

                                <div
                                    key={c.id}
                                    style={comment}
                                >
                                    <b>{c.userName}</b> : {c.content}
                                </div>

                            ))}

                        </div>

                        {/* ================= COMMENT INPUT ================= */}

                        <div style={inputRow}>

                            <input
                                value={
                                    commentInput[post.id] || ""
                                }
                                onChange={(e) =>
                                    setCommentInput({
                                        ...commentInput,
                                        [post.id]:
                                        e.target.value
                                    })
                                }
                                placeholder="Write a comment..."
                                style={input}
                            />

                            <button
                                onClick={() =>
                                    handleAddComment(
                                        Number(post.id)
                                    )
                                }
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

// ================= STYLES =================

// ================= STYLES =================

const container = {
    minHeight: "100vh",
    background:
        "linear-gradient(to bottom right, #020617, #0f172a, #111827)",
    color: "white",
    paddingBottom: "40px"
};

const navbar = {
    width: "100%",
    padding: "6px 16px",
    height: "55px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255,255,255,0.04)",
    backdropFilter: "blur(12px)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    boxSizing: "border-box"
};

const logo = {
    fontSize: "15px",
    fontWeight: "700",
    margin: 0
};

const backBtn = {
    padding: "7px 13px",
    borderRadius: "8px",
    border: "none",
    background:
        "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px"
};

// ✅ UPDATED FEED CONTAINER

const feedContainer = {
    width: "100%",
    maxWidth: "1400px",
    margin: "25px auto",
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(380px, 1fr))",
    gap: "24px",
    padding: "0 20px",
    boxSizing: "border-box",
    justifyItems: "center" // ✅ IMPORTANT
};

// ✅ UPDATED CARD

const card = {
    width: "100%",
    maxWidth: "420px", // ✅ IMPORTANT
    minHeight: "320px",
    padding: "18px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow:
        "0 8px 40px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    overflow: "hidden",
    margin: "0 auto" // ✅ IMPORTANT
};

const topRow = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px"
};

const userInfo = {
    display: "flex",
    alignItems: "center",
    gap: "10px"
};

const avatar = {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.1)"
};

const username = {
    fontSize: "15px",
    fontWeight: "600",
    margin: 0
};

const timeText = {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    marginTop: "2px"
};

const title = {
    fontSize: "22px",
    marginBottom: "10px",
    fontWeight: "700"
};

const content = {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "rgba(255,255,255,0.85)",
    marginBottom: "12px"
};

const postImg = {
    width: "100%",
    maxHeight: "220px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "12px"
};

const actionRow = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "12px",
    marginBottom: "12px",
    flexWrap: "wrap"
};

const likeBtn = {
    padding: "7px 12px",
    borderRadius: "9px",
    border: "none",
    background:
        "linear-gradient(135deg, #ec4899, #f43f5e)",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px"
};

const deleteBtn = {
    padding: "7px 12px",
    borderRadius: "9px",
    border: "none",
    background:
        "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px"
};

const commentSection = {
    marginBottom: "12px",
    maxHeight: "90px",
    overflowY: "auto"
};

const comment = {
    padding: "8px 10px",
    borderRadius: "9px",
    background: "rgba(255,255,255,0.05)",
    marginBottom: "6px",
    color: "rgba(255,255,255,0.9)",
    fontSize: "12px"
};

const inputRow = {
    display: "flex",
    gap: "8px",
    marginTop: "auto"
};

const input = {
    flex: 1,
    padding: "10px",
    borderRadius: "9px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    outline: "none",
    fontSize: "12px"
};

const postBtn = {
    padding: "10px 15px",
    borderRadius: "9px",
    border: "none",
    background:
        "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px"
};