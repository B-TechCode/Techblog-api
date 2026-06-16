import { useState } from "react";
import API from "../api/axios";

const CreatePost = ({ refreshPosts, goToFeed }) => {

    const [form, setForm] = useState({
        title: "",
        content: "",
        image: null
    });

    const [preview, setPreview] = useState("");

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");

    // ================= IMAGE =================

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) return;

        setForm({
            ...form,
            image: file
        });

        setPreview(
            URL.createObjectURL(file)
        );
    };

    // ================= SUBMIT =================

    const handleSubmit = async (e) => {

        e.preventDefault();

        let newErrors = {};

        if (!form.title.trim()) {
            newErrors.title = "Title is required";
        }

        if (!form.content.trim()) {
            newErrors.content = "Content is required";
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) return;

        try {

            setLoading(true);

            let imageName = null;

            // ================= IMAGE UPLOAD =================

            if (form.image) {

                const formData = new FormData();

                formData.append("file", form.image);

                const uploadRes = await API.post(
                    "/users/upload",
                    formData,
                    {
                        headers: {
                            "Content-Type":
                                "multipart/form-data"
                        }
                    }
                );

                imageName =
                    uploadRes.data.fileName;
            }

            // ================= CREATE POST =================

            const data = {
                title: form.title,
                content: form.content,
                image: imageName
            };

            await API.post("/posts", data);

            // ================= RESET =================

            setForm({
                title: "",
                content: "",
                image: null
            });

            setPreview("");

            setSuccess(
                "Post created successfully ✅"
            );

            if (refreshPosts) {
                refreshPosts();
            }

            setTimeout(() => {

                if (goToFeed) {
                    goToFeed();
                }

            }, 700);

        } catch (err) {

            console.error(
                "CREATE POST ERROR:",
                err.response?.data || err.message
            );

            alert("Failed to create post");

        } finally {

            setLoading(false);
        }
    };

    return (

        <div style={wrapper}>

            <div style={cardStyle}>

                <h2 style={title}>
                    Create Post ✍️
                </h2>

                {success && (

                    <div style={successStyle}>
                        {success}
                    </div>

                )}

                <form onSubmit={handleSubmit}>

                    {/* ================= TITLE ================= */}

                    <input
                        type="text"
                        placeholder="Post Title"
                        value={form.title}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                title: e.target.value
                            })
                        }
                        style={inputStyle}
                    />

                    {errors.title && (

                        <p style={errorStyle}>
                            {errors.title}
                        </p>

                    )}

                    {/* ================= CONTENT ================= */}

                    <textarea
                        placeholder="Write your content..."
                        value={form.content}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                content: e.target.value
                            })
                        }
                        style={textareaStyle}
                    />

                    {errors.content && (

                        <p style={errorStyle}>
                            {errors.content}
                        </p>

                    )}

                    {/* ================= IMAGE PREVIEW ================= */}

                    {preview && (

                        <img
                            src={preview}
                            alt="preview"
                            style={previewImg}
                        />

                    )}

                    {/* ================= BUTTON ================= */}

                    <button
                        style={buttonStyle}
                        disabled={loading}
                    >
                        {loading
                            ? "Publishing..."
                            : "Publish Post"}
                    </button>

                </form>

            </div>

        </div>
    );
};

export default CreatePost;


/* ================= STYLES ================= */

const wrapper = {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
};

const cardStyle = {
    width: "100%",
    maxWidth: "680px",
    padding: "20px",
    marginBottom: "35px",
    borderRadius: "24px",
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(14px)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow:
        "0 8px 40px rgba(0,0,0,0.35)",
    color: "white"
};

const title = {
    fontSize: "24px",
    fontWeight: "700",
    marginBottom: "22px",
    textAlign: "center"
};

const inputStyle = {
    width: "100%",
    padding: "14px",
    marginBottom: "16px",
    borderRadius: "14px",
    border:
        "1px solid rgba(255,255,255,0.12)",
    background:
        "rgba(0,0,0,0.25)",
    color: "white",
    outline: "none",
    fontSize: "15px"
};

const textareaStyle = {
    ...inputStyle,
    minHeight: "140px",
    resize: "none"
};

const previewImg = {
    width: "100%",
    maxHeight: "220px",
    objectFit: "cover",
    borderRadius: "16px",
    marginBottom: "16px",
    border:
        "1px solid rgba(255,255,255,0.1)"
};

const buttonStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "14px",
    border: "none",
    background:
        "linear-gradient(135deg, #22c55e, #00e676)",
    color: "white",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer"
};

const errorStyle = {
    color: "#f87171",
    fontSize: "13px",
    marginBottom: "12px"
};

const successStyle = {
    background:
        "rgba(34,197,94,0.2)",
    border: "1px solid #22c55e",
    color: "#22c55e",
    padding: "10px",
    borderRadius: "12px",
    textAlign: "center",
    marginBottom: "18px"
};