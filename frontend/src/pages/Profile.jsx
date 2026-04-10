import { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = ({ goToDashboard }) => {

    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [editPost, setEditPost] = useState(null);
    const [likedPosts, setLikedPosts] = useState({});
    const [followed, setFollowed] = useState({});

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
            console.error(err);
        }
    };

    // DELETE
    const handleDelete = async (id) => {
        const token = localStorage.getItem("token");

        await API.delete(`/posts/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setPosts(prev => prev.filter(p => p.id !== id));
    };

    // UPDATE (WITH IMAGE)
    const handleUpdate = async () => {
        const token = localStorage.getItem("token");

        await API.put(`/posts/${editPost.id}`, {
            title: editPost.title,
            content: editPost.content,
            image: editPost.image   // ✅ FIX
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });

        fetchProfile();
        setEditPost(null);
    };

    // LIKE TOGGLE
    const handleLike = async (postId) => {
        const token = localStorage.getItem("token");

        await API.post(`/likes/${postId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setLikedPosts(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    // FOLLOW TOGGLE
    const handleFollow = async (userId) => {
        const token = localStorage.getItem("token");

        await API.post(`/follow/${userId}`, {}, {
            headers: { Authorization: `Bearer ${token}` }
        });

        setFollowed(prev => ({
            ...prev,
            [userId]: !prev[userId]
        }));
    };

    return (
        <div style={mainStyle}>

            {/* NAVBAR */}
            <div style={navStyle}>
                <h2>My Profile</h2>
                <button onClick={goToDashboard} style={backBtn}>Back</button>
            </div>

            <div style={{ padding: "20px" }}>
                <h3>Welcome back!</h3>

                <h3 style={{ marginTop: "20px" }}>My Posts</h3>

                <div style={gridStyle}>
                    {posts.map(post => (

                        <div key={post.id} style={cardStyle}>

                            {/* LEFT PROFILE */}
                            <div style={{ textAlign: "center" }}>
                                <img
                                    src={
                                        user.profile_pic
                                            ? `http://localhost:8080/uploads/${user.profile_pic}`
                                            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                                    }
                                    style={profileImg}
                                />
                                <p style={{ fontSize: "12px" }}>{user.name}</p>
                            </div>

                            {/* CENTER */}
                            <div style={{ flex: 1, textAlign: "center" }}>
                                <h3>{post.title}</h3>
                                <p>{post.content}</p>

                                {post.image && (
                                    <img
                                        src={`http://localhost:8080/uploads/${post.image}`}
                                        style={postImg}
                                        onError={(e)=> e.target.style.display="none"}
                                    />
                                )}
                            </div>

                            {/* RIGHT */}
                            <div>

                                <button onClick={()=>setEditPost(post)} style={editBtn}>
                                    Edit
                                </button>

                                <button onClick={()=>handleDelete(post.id)} style={deleteBtn}>
                                    Delete
                                </button>

                                <button
                                    onClick={()=>handleFollow(post.user.id)}
                                    style={followBtn}
                                >
                                    {followed[post.user.id] ? "Unfollow" : "Follow"}
                                </button>

                                <div
                                    onClick={()=>handleLike(post.id)}
                                    style={{
                                        fontSize: "22px",
                                        cursor: "pointer",
                                        color: likedPosts[post.id] ? "red" : "white"
                                    }}
                                >
                                    ❤️
                                </div>

                            </div>

                        </div>
                    ))}
                </div>
            </div>

            {/* EDIT MODAL */}
            {editPost && (
                <div style={modalBg}>
                    <div style={modalBox}>

                        <h3>Edit Post</h3>

                        <input
                            value={editPost.title}
                            onChange={(e)=>setEditPost({...editPost, title:e.target.value})}
                            style={input}
                        />

                        <textarea
                            value={editPost.content}
                            onChange={(e)=>setEditPost({...editPost, content:e.target.value})}
                            style={input}
                        />

                        {/* ✅ IMAGE INPUT ADDED */}
                        <input
                            type="text"
                            placeholder="Image name (optional)"
                            value={editPost.image || ""}
                            onChange={(e)=>setEditPost({...editPost, image:e.target.value})}
                            style={input}
                        />

                        <button style={saveBtn} onClick={handleUpdate}>
                            Update
                        </button>

                        <button style={cancelBtn} onClick={()=>setEditPost(null)}>
                            Cancel
                        </button>

                    </div>
                </div>
            )}

        </div>
    );
};

export default Profile;


/* 🎨 STYLES */

const gridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",  // ✅ 2 per row
    gap: "20px",
    marginTop: "20px"
};

const cardStyle = {
    display: "flex",
    gap: "10px",
    padding: "15px",
    borderRadius: "10px",
    background: "#1e293b"
};

const profileImg = {
    width: "40px",
    height: "40px",
    borderRadius: "50%"
};

const postImg = {
    width: "100%",
    height: "120px",
    objectFit: "cover",
    borderRadius: "8px"
};