import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

const Notifications = ({ goToDashboard }) => {

    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        fetchNotifications();

        const interval = setInterval(() => {
            fetchNotifications();
        }, 5000);

        return () => clearInterval(interval);

    }, []);

    const fetchNotifications = async () => {

        try {

            setLoading(true);

            const data = await getNotifications();

            setNotifications(data);

            setError(null);

        } catch (err) {

            console.error(err);

            setError("Failed to load notifications.");

        } finally {

            setLoading(false);
        }
    };

    return (

        <div style={styles.page}>

            {/* ================= NAVBAR ================= */}

            <div style={styles.navbar}>

                <button
                    onClick={goToDashboard}
                    style={styles.backBtn}
                >
                    ← Back
                </button>

                <h2 style={styles.heading}>
                    🔔 Notifications
                </h2>

                <div style={{ width: "90px" }} />

            </div>

            {/* ================= LOADING ================= */}

            {loading && (

                <div style={styles.centerBox}>
                    Loading Notifications...
                </div>

            )}

            {/* ================= ERROR ================= */}

            {!loading && error && (

                <div style={styles.error}>
                    {error}
                </div>

            )}

            {/* ================= EMPTY ================= */}

            {!loading &&
                !error &&
                notifications.length === 0 && (

                    <div style={styles.emptyCard}>

                        <h2>No Notifications</h2>

                        <p>
                            You're all caught up 🎉
                        </p>

                    </div>

                )}

            {/* ================= NOTIFICATION LIST ================= */}

            {!loading &&
                !error &&
                notifications.length > 0 && (

                    <div style={styles.list}>

                        {notifications.map((notif) => (

                            <div
                                key={notif.id}
                                style={styles.card}
                            >

                                <div style={styles.icon}>
                                    🔔
                                </div>

                                <div style={{ flex: 1 }}>

                                    <div style={styles.message}>
                                        {notif.message}
                                    </div>

                                    <div style={styles.time}>
                                        {new Date(
                                            notif.createdAt
                                        ).toLocaleString()}
                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

        </div>
    );
};

export default Notifications;

const styles = {

    page: {

        minHeight: "100vh",

        background:
            "linear-gradient(to bottom right,#020617,#0f172a)",

        color: "white",

        padding: "25px"
    },

    navbar: {

        width: "100%",

        maxWidth: "850px",

        margin: "0 auto 35px",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center"
    },

    heading: {

        fontSize: "32px",

        margin: 0,

        fontWeight: "700"
    },

    backBtn: {

        border: "none",

        padding: "10px 20px",

        borderRadius: "10px",

        cursor: "pointer",

        color: "white",

        fontWeight: "600",

        background:
            "linear-gradient(135deg,#2563eb,#38bdf8)"
    },

    centerBox: {

        textAlign: "center",

        fontSize: "18px",

        marginTop: "120px"
    },

    error: {

        maxWidth: "700px",

        margin: "30px auto",

        padding: "15px",

        borderRadius: "12px",

        color: "#ffb4b4",

        background: "#4a1010",

        textAlign: "center"
    },

    emptyCard: {

        maxWidth: "650px",

        margin: "100px auto",

        textAlign: "center",

        padding: "40px",

        borderRadius: "18px",

        background: "rgba(255,255,255,.05)"
    },

    list: {

        maxWidth: "850px",

        margin: "0 auto",

        display: "flex",

        flexDirection: "column",

        gap: "18px"
    },

    card: {

        display: "flex",

        gap: "20px",

        alignItems: "center",

        padding: "20px",

        borderRadius: "16px",

        background: "rgba(255,255,255,.06)",

        border:
            "1px solid rgba(255,255,255,.08)",

        boxShadow:
            "0 10px 35px rgba(0,0,0,.35)"
    },

    icon: {

        fontSize: "26px"
    },

    message: {

        fontSize: "17px",

        fontWeight: "600",

        marginBottom: "8px"
    },

    time: {

        color: "#94a3b8",

        fontSize: "13px"
    }
};