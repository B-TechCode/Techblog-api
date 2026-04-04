import { useState, useEffect } from "react";
import API from "../api/axios";

const Upload = () => {

    const [file, setFile] = useState(null);
    const [imageUrl, setImageUrl] = useState("");
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const savedImage = localStorage.getItem("profilePic");
        if (savedImage) {
            setImageUrl(savedImage);
        }
    }, []);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);

        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        }

        setMessage("");
        setError("");
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("file", file);

            const res = await API.post("/users/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            setMessage("Profile updated successfully!");

            setImageUrl(res.data.url);
            localStorage.setItem("profilePic", res.data.url);

            setPreview("");
            setFile(null);

            setTimeout(() => setMessage(""), 2000);

        } catch (err) {
            console.error(err);
            setError("Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    // 🎨 STYLES (UNCHANGED)
    const cardStyle = {
        width: "100%",
        padding: "5px",
        borderRadius: "12px",
        background: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(6px)",
        color: "white",
        border: "1px solid rgba(255,255,255,0.2)",
        textAlign: "center",
        marginTop: "10px",
        transition: "0.3s",
        cursor: "pointer"
    };

    const titleStyle = {
        fontSize: "15px",
        marginBottom: "8px",
        fontWeight: "600"
    };

    const imageStyle = {
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        objectFit: "cover",
        margin: "8px 0",
        border: "2px solid white",
        transition: "0.3s"
    };

    const previewStyle = {
        ...imageStyle,
        border: "2px solid #00c6ff"
    };

    const fileBtn = {
        display: "inline-block",
        padding: "6px 12px",
        background: "#1e90ff",
        color: "white",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
        marginTop: "6px"
    };

    const uploadBtn = {
        padding: "7px 14px",
        background: "linear-gradient(45deg, #00c6ff, #0072ff)",
        border: "none",
        borderRadius: "6px",
        color: "white",
        cursor: "pointer",
        fontSize: "13px",
        marginTop: "8px"
    };

    const hiddenInput = {
        display: "none"
    };

    return (
        <div
            style={cardStyle}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.03)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
            }}
        >

            <h4 style={titleStyle}>
                Upload Profile Picture
            </h4>

            {message && (
                <p style={{
                    background: "#28a745",
                    padding: "6px",
                    borderRadius: "5px",
                    fontSize: "12px"
                }}>
                    {message}
                </p>
            )}

            {error && (
                <p style={{
                    background: "#ff4d4f",
                    padding: "6px",
                    borderRadius: "5px",
                    fontSize: "12px"
                }}>
                    {error}
                </p>
            )}

            {imageUrl && !preview && (
                <img
                    src={imageUrl}
                    alt="Profile"
                    style={imageStyle}
                    onMouseEnter={(e)=> e.target.style.transform="scale(1.1)"}
                    onMouseLeave={(e)=> e.target.style.transform="scale(1)"}
                />
            )}

            {preview && (
                <img
                    src={preview}
                    alt="Preview"
                    style={previewStyle}
                    onMouseEnter={(e)=> e.target.style.transform="scale(1.1)"}
                    onMouseLeave={(e)=> e.target.style.transform="scale(1)"}
                />
            )}

            <label style={fileBtn}>
                Choose Image
                <input
                    type="file"
                    style={hiddenInput}
                    onChange={handleFileChange}
                />
            </label>

            <br />

            <button
                style={uploadBtn}
                onClick={handleUpload}
                disabled={loading}
                onMouseEnter={(e)=>e.target.style.opacity="0.8"}
                onMouseLeave={(e)=>e.target.style.opacity="1"}
            >
                {loading ? "Uploading..." : "Upload"}
            </button>

        </div>
    );
};

export default Upload;