import { useState } from "react";
import API from "../api/axios";

const CreatePost = ({ refreshPosts, goToFeed }) => {

    const [form, setForm] = useState({
        title: "",
        content: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        let newErrors = {};

        if (!form.title.trim()) newErrors.title = "Title is required";
        if (!form.content.trim()) newErrors.content = "Content is required";

        setErrors(newErrors);
        if (Object.keys(newErrors).length > 0) return;

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("content", form.content);

            // 🔥 USE PROFILE IMAGE NAME
            const profileImage = localStorage.getItem("profileImage");
            if (profileImage) {
                formData.append("imageName", profileImage);
            }

            await API.post("/posts", formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setForm({ title: "", content: "" });
            setSuccess("Post created successfully!");

            // 🔥 refresh + redirect
            if (refreshPosts) refreshPosts();

            setTimeout(() => {
                if (goToFeed) goToFeed();
            }, 800);

        } catch (err) {
            console.error("CREATE POST ERROR:", err.response?.data || err.message);
            alert("Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={cardStyle}
            onMouseEnter={(e)=>{
                e.currentTarget.style.transform="scale(1.03)";
                e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.6)";
            }}
            onMouseLeave={(e)=>{
                e.currentTarget.style.transform="scale(1)";
                e.currentTarget.style.boxShadow="0 10px 30px rgba(0,0,0,0.3)";
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
                Create Post ✍️
            </h2>

            {success && (
                <p style={successStyle}>
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    placeholder="Post Title"
                    value={form.title}
                    onChange={(e)=>setForm({...form, title: e.target.value})}
                    style={inputStyle}
                />
                {errors.title && <p style={errorStyle}>{errors.title}</p>}

                <textarea
                    placeholder="Write your content..."
                    value={form.content}
                    onChange={(e)=>setForm({...form, content: e.target.value})}
                    style={textareaStyle}
                />
                {errors.content && <p style={errorStyle}>{errors.content}</p>}

                <button style={buttonStyle} disabled={loading}>
                    {loading ? "Posting..." : "Publish Post"}
                </button>

            </form>
        </div>
    );
};

// 🎨 STYLES

const cardStyle = {
    width: "450px",
    marginTop: "15px",
    padding: "20px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(12px)",
    color: "white",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease"
};

const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(0,0,0,0.5)",
    color: "#ffffff",
    outline: "none"
};

const textareaStyle = {
    ...inputStyle,
    height: "100px",
    resize: "none"
};

const buttonStyle = {
    width: "100%",
    padding: "10px",
    background: "linear-gradient(45deg, #00c853, #00e676)",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold"
};

const errorStyle = {
    color: "#ff6b6b",
    fontSize: "12px"
};

const successStyle = {
    background: "#22c55e",
    padding: "8px",
    borderRadius: "6px",
    textAlign: "center"
};

export default CreatePost;