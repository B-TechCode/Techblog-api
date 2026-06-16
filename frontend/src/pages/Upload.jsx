import { useState, useEffect } from "react";
import API from "../api/axios";

const Upload = ({ onUploadSuccess }) => {

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState("");
    const [imageName, setImageName] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // ================= LOAD SAVED IMAGE =================

    useEffect(() => {

        const saved = localStorage.getItem("profileImage");

        if (saved && saved !== "undefined") {
            setImageName(saved);
        }

    }, []);

    // ================= HANDLE FILE =================

    const handleFileChange = (e) => {

        const selected = e.target.files[0];

        if (!selected) return;

        if (!selected.type.startsWith("image/")) {

            alert("Only image files allowed");

            return;
        }

        setFile(selected);

        const previewURL = URL.createObjectURL(selected);

        setPreview(previewURL);
    };

    // ================= HANDLE UPLOAD =================

    const handleUpload = async () => {

        if (!file) {

            alert("Select image");

            return;
        }

        try {

            setLoading(true);

            const formData = new FormData();

            formData.append("file", file);

            const res = await API.post(
                "/users/upload",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );

            const imgName = res?.data?.fileName;

            if (
                !imgName ||
                imgName === "undefined"
            ) {

                throw new Error(
                    "Invalid image response"
                );
            }

            // ✅ SAVE IMAGE
            localStorage.setItem(
                "profileImage",
                imgName
            );

            setImageName(imgName);

            // ✅ CLEAR PREVIEW
            setPreview("");

            setFile(null);

            // ✅ UPDATE DASHBOARD
            if (onUploadSuccess) {
                onUploadSuccess(imgName);
            }

            setMessage(
                "Profile uploaded successfully ✅"
            );

            setTimeout(() => {
                setMessage("");
            }, 2500);

        } catch (err) {

            console.error(
                "UPLOAD ERROR:",
                err.response?.data || err.message
            );

            alert("Upload failed!");

        } finally {

            setLoading(false);
        }
    };

    // ================= FINAL IMAGE =================

    const finalImage = preview
        ? preview
        : imageName
            ? `http://localhost:8080/api/users/uploads/${imageName}`
            : "";

    return (

        <div style={container}>

            <h3 style={title}>
                Upload Profile Picture
            </h3>

            {/* ================= IMAGE ================= */}

            {finalImage ? (

                <img
                    src={finalImage}
                    alt="preview"
                    style={imageStyle}
                    onError={(e) => {
                        e.target.src =
                            "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                />

            ) : (

                <div style={emptyPreview}>
                    👤
                </div>

            )}

            {/* ================= BUTTONS ================= */}

            <div style={buttonRow}>

                <label style={chooseBtn}>

                    Choose Image

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
                    {loading
                        ? "Uploading..."
                        : "Upload"}
                </button>

            </div>

            {/* ================= FILE NAME ================= */}

            {file && (

                <p style={fileName}>
                    {file.name}
                </p>

            )}

            {/* ================= SUCCESS MESSAGE ================= */}

            {message && (

                <div style={msg}>
                    {message}
                </div>

            )}

        </div>
    );
};

export default Upload;


/* ================= STYLES ================= */
const container = {
    width: "100%",
    padding: "12px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    textAlign: "center"
};

const title = {
    fontSize: "13px",
    marginBottom: "10px",
    fontWeight: "600"
};

const imageStyle = {
    width: "78px",
    height: "78px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid rgba(255,255,255,0.15)",
    marginBottom: "10px"
};

const emptyPreview = {
    width: "78px",
    height: "78px",
    borderRadius: "50%",
    background: "rgba(255,255,255,0.06)",
    border: "2px solid rgba(255,255,255,0.08)",
    margin: "0 auto 10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "28px"
};

const buttonRow = {
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    flexWrap: "wrap"
};

const chooseBtn = {
    padding: "8px 12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.08)",
    color: "white",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "12px"
};

const uploadBtn = {
    padding: "8px 14px",
    borderRadius: "10px",
    border: "none",
    background:
        "linear-gradient(135deg, #2563eb, #38bdf8)",
    color: "white",
    fontWeight: "600",
    cursor: "pointer",
    fontSize: "12px"
};

const fileName = {
    marginTop: "8px",
    color: "rgba(255,255,255,0.7)",
    fontSize: "11px",
    wordBreak: "break-word"
};

const msg = {
    marginTop: "10px",
    padding: "8px",
    borderRadius: "10px",
    background: "rgba(34,197,94,0.18)",
    border: "1px solid #22c55e",
    color: "#22c55e",
    fontSize: "11px"
};