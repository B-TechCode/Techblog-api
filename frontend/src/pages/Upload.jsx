import { useState, useEffect } from "react";
import API from "../api/axios";

const Upload = ({ onUploadSuccess }) => {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [imageName, setImageName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ✅ Load saved image on refresh
    useEffect(() => {
        const saved = localStorage.getItem("profileImage");
        if (saved) {
            setImageName(saved);
        }
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        if (!selected.type.startsWith("image/")) {
            alert("Only image files allowed");
            return;
        }

        setFile(selected);

        // ✅ Preview
        const previewURL = URL.createObjectURL(selected);
        setPreview(previewURL);
    };

    const handleUpload = async () => {

        if (!file) {
            alert("Select image");
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");

            const formData = new FormData();
            formData.append("file", file);

            const res = await API.post("/users/upload", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            // ✅ SAFE RESPONSE
            const imgName =
                res?.data?.image ||
                res?.data?.fileName ||
                res?.data?.name ||
                res?.data;

            if (!imgName || imgName === "undefined") {
                throw new Error("Invalid image response");
            }

            console.log("Uploaded Image:", imgName);

            // ✅ Save globally
            localStorage.setItem("profileImage", imgName);
            setImageName(imgName);

            // ✅ Update parent instantly (Dashboard)
            if (onUploadSuccess) {
                onUploadSuccess(imgName);
            }

            setMessage("Uploaded ✅");
            setFile(null);
            setPreview("");

            setTimeout(() => setMessage(""), 2000);

        } catch (err) {
            console.error("UPLOAD ERROR:", err.response?.data || err.message);
            alert("Upload failed!");
        } finally {
            setLoading(false);
        }
    };

    // ✅ FINAL IMAGE TO SHOW
    const finalImage = preview
        ? preview
        : imageName
            ? `http://localhost:8080/uploads/${imageName}`
            : "";

    return (
        <div style={box}>

            <h4 style={title}>Upload Profile</h4>


            <div style={row}>

                <label style={chooseBtn}>
                    Choose
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />
                </label>

                <button
                    onClick={handleUpload}
                    style={uploadBtn}
                    disabled={loading}
                >
                    {loading ? "..." : "Upload"}
                </button>

            </div>

            {message && <p style={msg}>{message}</p>}

        </div>
    );
};

export default Upload;


/* 🎨 STYLES */

const box = {
    marginTop: "10px",
    padding: "10px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.1)",
    textAlign: "center"
};

const title = {
    fontSize: "14px",
    marginBottom: "8px"
};

const row = {
    display: "flex",
    gap: "10px",
    justifyContent: "center"
};

const imageStyle = {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "10px",
    border: "2px solid #38bdf8"
};

const chooseBtn = {
    background: "#3b82f6",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "white",
    fontSize: "13px"
};

const uploadBtn = {
    background: "#06b6d4",
    padding: "5px 10px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
    fontSize: "13px"
};

const msg = {
    marginTop: "6px",
    fontSize: "12px",
    color: "#22c55e"
};