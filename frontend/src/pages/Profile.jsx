import { useEffect, useState } from "react";
import API from "../api/axios";
import FollowersList from "../components/FollowersList";

import FollowingList from "../components/FollowingList";

import { updateProfile } from "../services/userService";
const Profile = ({ goToDashboard }) => {

    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);
    const [editPost, setEditPost] = useState(null);

    const [likes, setLikes] = useState({});
    const [likedPosts, setLikedPosts] = useState({});

    const [profileImage, setProfileImage] =
        useState(null);
    const [editMode, setEditMode] =
        useState(false);

    const [nameInput, setNameInput] =
        useState("");

    const [aboutInput, setAboutInput] =
        useState("");

    const [genderInput, setGenderInput] =
        useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    // ================= FETCH PROFILE =================

    const fetchProfile = async () => {

        try {

            const res = await API.get("/users/me");



            setUser(res.data);

            setNameInput(res.data.name || "");

            setAboutInput(res.data.about || "");

            setGenderInput(res.data.gender || "");

            const postRes = await API.get("/posts/my");

            const data = postRes.data.reverse();

            setPosts(data);

            data.forEach((p) => {

                if (!p?.id) return;

                fetchLikes(Number(p.id));

                checkIfLiked(Number(p.id));

            });

        } catch (err) {

            console.error(err);
        }
    };

    // ================= FETCH LIKES =================

    const fetchLikes = async (postId) => {

        if (!postId) return;

        try {

            const res =
                await API.get(`/likes/${postId}`);

            setLikes((prev) => ({
                ...prev,
                [postId]: res.data
            }));

        } catch (err) {

            console.error(err);
        }
    };

    // ================= CHECK IF LIKED =================

    const checkIfLiked = async (postId) => {

        if (!postId) return;

        try {

            const res =
                await API.get(
                    `/likes/check/${postId}`
                );

            setLikedPosts((prev) => ({
                ...prev,
                [postId]: res.data
            }));

        } catch (err) {

            console.error(err);
        }
    };

    // ================= HANDLE LIKE =================

    const handleLike = async (postId) => {

        if (!postId) return;

        try {

            await API.post(`/likes/${postId}`);

            fetchLikes(postId);

            checkIfLiked(postId);

        } catch (err) {

            console.error(err);
        }
    };

    // ================= DELETE POST =================

    const handleDelete = async (id) => {

        if (!id) return;

        try {

            await API.delete(`/posts/${id}`);

            setPosts((prev) =>
                prev.filter((p) => p.id !== id)
            );

        } catch (err) {

            console.error(err);

            alert("Delete failed");
        }
    };

    // ================= UPDATE POST =================

    const handleUpdate = async () => {

        try {

            await API.put(
                `/posts/${editPost.id}`,
                {
                    title: editPost.title,
                    content: editPost.content
                }
            );

            fetchProfile();

            setEditPost(null);

            alert("Post updated successfully");

        } catch (err) {

            console.error(err);

            alert("Update failed");
        }
    };

    // ================= PROFILE IMAGE UPDATE =================

    const handleProfileImageUpdate =
        async () => {

            if (!profileImage) {

                alert("Select image first");

                return;
            }

            try {

                const formData =
                    new FormData();

                formData.append(
                    "file",
                    profileImage
                );

                await API.post(
                    "/users/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );

                fetchProfile();

                alert(
                    "Profile image updated"
                );

            } catch (err) {

                console.error(err);

                alert("Image update failed");
            }
        };


    // ================= UPDATE PROFILE =================

    const handleProfileUpdate = async () => {

        try {

            const updatedUser =
                await updateProfile({

                    name: nameInput,

                    about: aboutInput,

                    gender: genderInput
                });

            setUser(updatedUser);

            setEditMode(false);

            alert(
                "Profile updated successfully"
            );

        } catch (err) {

            console.error(err);

            alert(
                "Profile update failed"
            );
        }
    };


    return (

        <div style={container}>

            {/* ================= NAVBAR ================= */}

            <div style={navbar}>

                <h1 style={logo}>
                    My Profile
                </h1>

                <button
                    onClick={goToDashboard}
                    style={backBtn}
                >
                    Dashboard
                </button>

            </div>

            {/* ================= PROFILE CARD ================= */}

            <div style={profileSection}>

                <div style={profileCard}>

                    <img
                        src={
                            user.profilePic
                                ? `http://localhost:8080/uploads/${user.profilePic}`
                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        alt=""
                        style={profileImg}
                        onError={(e) => {
                            e.target.src =
                                "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                        }}
                    />

                    {editMode ? (

                        <>

                            <input
                                type="text"
                                value={nameInput}
                                onChange={(e) =>
                                    setNameInput(
                                        e.target.value
                                    )
                                }
                                placeholder="Name"
                                style={inputStyle}
                            />

                            <textarea
                                value={aboutInput}
                                onChange={(e) =>
                                    setAboutInput(
                                        e.target.value
                                    )
                                }
                                placeholder="About"
                                style={textareaStyle}
                            />

                            <select
                                value={genderInput}
                                onChange={(e) =>
                                    setGenderInput(
                                        e.target.value
                                    )
                                }
                                style={inputStyle}
                            >

                                <option value="">
                                    Select Gender
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                            </select>

                            <button
                                onClick={
                                    handleProfileUpdate
                                }
                                style={profileBtn}
                            >
                                Save Profile
                            </button>

                        </>

                    ) : (

                        <>

                            <h2 style={name}>
                                {user.name}
                            </h2>

                            <p style={bio}>
                                {user.about ||
                                    "No bio added"}
                            </p>

                            <p style={bio}>
                                {user.gender}
                            </p>

                            <button
                                onClick={() =>
                                    setEditMode(true)
                                }
                                style={profileBtn}
                            >
                                Edit Profile
                            </button>

                        </>

                    )}

                    <div style={statsRow}>

                        <div style={statBox}>
                            <h3>{posts.length}</h3>
                            <p>Posts</p>
                        </div>

                        <div style={statBox}>
                            <h3>{user.followersCount || 0}</h3>
                            <p>Followers</p>
                        </div>

                        <div style={statBox}>
                            <h3>{user.followingCount || 0}</h3>
                            <p>Following</p>
                        </div>

                    </div>

                    <FollowersList />
                    <FollowingList />

                    {/* PROFILE IMAGE UPDATE */}

                    <div style={profileUpdateSection}>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setProfileImage(
                                    e.target.files[0]
                                )
                            }
                            style={fileInput}
                        />

                        <button
                            onClick={
                                handleProfileImageUpdate
                            }
                            style={profileBtn}
                        >
                            Change Profile Photo
                        </button>

                    </div>

                </div>

            </div>

            {/* ================= POSTS ================= */}

            <div style={postsContainer}>

                {posts.length === 0 && (

                    <h2 style={emptyText}>
                        No posts yet
                    </h2>

                )}

                {posts.map((post) => (

                    <div
                        key={post.id}
                        style={cardStyle}
                    >

                        <h2 style={title}>
                            {post.title}
                        </h2>

                        <p style={timeText}>
                            {new Date(
                                post.createdAt
                            ).toLocaleString()}
                        </p>

                        <p style={content}>
                            {post.content}
                        </p>

                        {/* COMMENTS */}

                        {post.comments && post.comments.length > 0 && (

                            <div style={commentSection}>

                                {post.comments.map((comment) => (

                                    <div
                                        key={comment.id}
                                        style={commentStyle}
                                    >

                                        <strong>
                                            {comment.user?.name}
                                        </strong>

                                        : {comment.content}

                                    </div>

                                ))}

                            </div>
                        )}

                        {post.image &&
                            post.image !== "" && (

                                <img
                                    src={`http://localhost:8080/uploads/${post.image}`}
                                    alt=""
                                    style={postImg}
                                    onError={(e) => {
                                        e.target.style.display =
                                            "none";
                                    }}
                                />
                            )}

                        {/* ================= ACTIONS ================= */}

                        <div style={actionRow}>

                            <button
                                onClick={() =>
                                    handleLike(post.id)
                                }
                                style={{
                                    ...likeBtn,
                                    background:
                                        likedPosts[
                                            post.id
                                            ]
                                            ? "#ff4d6d"
                                            : "rgba(255,255,255,0.08)"
                                }}
                            >
                                ❤️ {likes[post.id] || 0}
                            </button>

                            <button
                                onClick={() =>
                                    setEditPost(post)
                                }
                                style={editBtn}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() =>
                                    handleDelete(post.id)
                                }
                                style={deleteBtn}
                            >
                                🗑 Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>

            {/* ================= EDIT MODAL ================= */}

            {editPost && (

                <div style={modalBg}>

                    <div style={modalBox}>

                        <h2 style={modalTitle}>
                            Edit Post
                        </h2>

                        <input
                            type="text"
                            value={editPost.title}
                            onChange={(e) =>
                                setEditPost({
                                    ...editPost,
                                    title:
                                    e.target.value
                                })
                            }
                            style={inputStyle}
                        />

                        <textarea
                            value={editPost.content}
                            onChange={(e) =>
                                setEditPost({
                                    ...editPost,
                                    content:
                                    e.target.value
                                })
                            }
                            style={textareaStyle}
                        />

                        <div style={modalButtons}>

                            <button
                                onClick={handleUpdate}
                                style={saveBtn}
                            >
                                Update
                            </button>

                            <button
                                onClick={() =>
                                    setEditPost(null)
                                }
                                style={cancelBtn}
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
    borderBottom:
        "1px solid rgba(255,255,255,0.08)",
    position: "sticky",
    top: 0,
    zIndex: 1000
};

const logo = {
    fontSize: "15px",
    fontWeight: "700"
};

const backBtn = {
    padding: "7px 13px",
    borderRadius: "8px",
    border: "none",
    background:
        "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
};

const profileSection = {
    display: "flex",
    justifyContent: "center",
    marginTop: "25px"
};

const profileCard = {
    width: "100%",
    maxWidth: "450px",
    padding: "25px 20px",
    borderRadius: "20px",
    background: "rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    border:
        "1px solid rgba(255,255,255,0.08)",
    textAlign: "center",
    margin: "20px auto"
};

const profileImg = {
    width: "110px",
    height: "110px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #38bdf8",
    marginBottom: "12px"
};

const name = {
    fontSize: "24px",
    marginBottom: "8px"
};

const bio = {
    color: "rgba(255,255,255,0.7)",
    fontSize: "13px",
    marginBottom: "18px"
};

const statsRow = {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginBottom: "18px"
};

const statBox = {
    padding: "10px 16px",
    borderRadius: "12px",
    background:
        "rgba(255,255,255,0.05)"
};

const profileUpdateSection = {
    marginTop: "15px"
};

const fileInput = {
    color: "white",
    marginBottom: "10px",
    width: "100%"
};

const profileBtn = {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "none",
    background:
        "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "white",
    cursor: "pointer",
    fontWeight: "600"
};

const postsContainer = {
    width: "100%",
    maxWidth: "1200px",
    margin: "30px auto",
    display: "grid",
    gridTemplateColumns:
        "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "20px",
    padding: "0 20px",
    justifyItems: "center"
};

const cardStyle = {
    width: "100%",
    maxWidth: "330px",
    minHeight: "320px",
    padding: "16px",
    borderRadius: "18px",
    background:
        "rgba(255,255,255,0.08)",
    backdropFilter: "blur(14px)",
    border:
        "1px solid rgba(255,255,255,0.08)",
    boxShadow:
        "0 8px 40px rgba(0,0,0,0.35)",
    display: "flex",
    flexDirection: "column"
};

const title = {
    fontSize: "20px",
    marginBottom: "8px",
    fontWeight: "700"
};

const timeText = {
    fontSize: "11px",
    color: "rgba(255,255,255,0.6)",
    marginBottom: "10px"
};

const content = {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "rgba(255,255,255,0.85)",
    marginBottom: "12px"
};

const postImg = {
    width: "100%",
    maxHeight: "200px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "12px"
};

const actionRow = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "auto",
    flexWrap: "wrap"
};

const likeBtn = {
    padding: "7px 12px",
    borderRadius: "9px",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px"
};

const editBtn = {
    padding: "7px 12px",
    borderRadius: "9px",
    border: "none",
    background:
        "linear-gradient(135deg, #f59e0b, #fbbf24)",
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

const emptyText = {
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    marginTop: "30px"
};

const modalBg = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999
};

const modalBox = {
    width: "90%",
    maxWidth: "420px",
    background: "#111827",
    padding: "22px",
    borderRadius: "18px"
};

const modalTitle = {
    marginBottom: "15px"
};

const inputStyle = {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    marginBottom: "12px",
    outline: "none"
};

const textareaStyle = {
    width: "100%",
    height: "120px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    resize: "none",
    marginBottom: "12px"
};

const modalButtons = {
    display: "flex",
    gap: "10px"
};

const saveBtn = {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    background:
        "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
};

const cancelBtn = {
    flex: 1,
    padding: "10px",
    border: "none",
    borderRadius: "10px",
    background:
        "linear-gradient(135deg, #ef4444, #dc2626)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer"
};


const commentSection = {
    marginTop: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "6px"
};

const commentStyle = {
    background: "rgba(255,255,255,0.06)",
    padding: "8px",
    borderRadius: "8px",
    fontSize: "12px"
};