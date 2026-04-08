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
            const token = localStorage.getItem("token");

            const res = await API.get("/posts", {
                headers: { Authorization: `Bearer ${token}` }
            });

            const data = res.data.reverse();
            setPosts(data);

            for (let post of data) {
                fetchComments(post.id);
            }

        } catch (err) {
            console.error("FETCH POSTS ERROR:", err);
        }
    };

    const fetchComments = async (postId) => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get(`/comments/${postId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setComments(prev => ({
                ...prev,
                [postId]: res.data
            }));

        } catch (err) {
            console.error("FETCH COMMENTS ERROR:", err);
        }
    };

    const handleAddComment = async (postId) => {
        const token = localStorage.getItem("token");
        const content = (commentInput[postId] || "").trim();

        if (!content) {
            alert("Comment cannot be empty");
            return;
        }

        try {
            await API.post(`/comments/${postId}`,
                { content },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // 🔥 FIX: refresh only this post comments (fast)
            await fetchComments(postId);

            setCommentInput(prev => ({
                ...prev,
                [postId]: ""
            }));

        } catch (err) {
            console.error("COMMENT ERROR:", err.response?.data || err.message);
            alert("Comment failed");
        }
    };

    const handleDeleteComment = async (commentId, postId) => {
        try {
            const token = localStorage.getItem("token");

            await API.delete(`/comments/${commentId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setComments(prev => ({
                ...prev,
                [postId]: prev[postId].filter(c => c.id !== commentId)
            }));

        } catch (err) {
            console.error("DELETE COMMENT ERROR:", err);
        }
    };

    return (
        <div style={mainStyle}>

            {/* NAVBAR */}
            <div style={navStyle}>
                <h2>Feed</h2>
                <button onClick={goToDashboard} style={backBtn}>Back</button>
            </div>

            {/* POSTS GRID */}
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

                        {/* IMAGE */}
                        {post.image && (
                            <img
                                src={`http://localhost:8080/uploads/${post.image}`}
                                alt="post"
                                style={imgStyle}
                            />
                        )}

                        {/* COMMENTS */}
                        <div>
                            {comments[post.id]?.map((c) => (
                                <div key={c.id} style={commentBox}>
                                    💬 {c.content}

                                    {(c.userEmail === userEmail || userEmail === "admin@gmail.com") && (
                                        <button
                                            style={deleteBtn}
                                            onClick={() => handleDeleteComment(c.id, post.id)}
                                        >
                                            ✖
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* INPUT */}
                        <div style={{ display: "flex", marginTop: "10px" }}>
                            <input
                                value={commentInput[post.id] || ""}
                                onChange={(e) =>
                                    setCommentInput({
                                        ...commentInput,
                                        [post.id]: e.target.value
                                    })
                                }
                                placeholder="Add comment..."
                                style={inputStyle}
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