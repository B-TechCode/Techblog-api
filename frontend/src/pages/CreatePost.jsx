import { useState } from "react";
import API from "../api/axios";

const CreatePost = ({ refreshPosts }) => {

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

            await API.post("/posts", form, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            setSuccess("Post created successfully!");
            setForm({ title: "", content: "" });

            if (refreshPosts) refreshPosts();

            setTimeout(() => setSuccess(""), 2000);

        } catch (err) {
            console.error(err);
            alert("Failed to create post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                width: "450px",
                marginTop: "15px",  ///Reduce margin top
                padding: "20px",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                color: "white",
                boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                transition: "0.3s"
            }}
            onMouseEnter={(e)=>{
                e.currentTarget.style.transform="scale(1.03)";
            }}
            onMouseLeave={(e)=>{
                e.currentTarget.style.transform="scale(1)";
            }}
        >
            <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
                Create Post ✍️
            </h2>

            {success && (
                <p style={{
                    background: "#22c55e",
                    padding: "8px",
                    borderRadius: "6px",
                    textAlign: "center"
                }}>
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

const inputStyle = {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid rgba(255,255,255,0.3)",
    background: "rgba(0,0,0,0.3)",   // 🔥 darker glass
    color: "#ffffff"                // 🔥 keep white
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
    cursor: "pointer"
};

const errorStyle = {
    color: "#ff6b6b",
    fontSize: "12px"
};

export default CreatePost;