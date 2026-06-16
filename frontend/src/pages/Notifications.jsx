// create simple notifications page using getNotifications service and useEffect only

import { useEffect, useState } from "react";
import { getNotifications } from "../services/notificationService";

const Notifications = () => {
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
            console.error("Failed to load notifications:", err);
            setError("Failed to load notifications");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div style={styles.container}><p>Loading...</p></div>;

    if (error) return <div style={styles.container}><p style={styles.error}>{error}</p></div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>🔔 Notifications</h1>

            {notifications.length === 0 ? (
                <p style={styles.empty}>No notifications</p>
            ) : (
                <div style={styles.list}>
                    {notifications.map((notif) => (
                        <div key={notif.id} style={styles.notifCard}>
                            <p style={styles.message}>{notif.message}</p>
                            <span style={styles.time}>
                             {new Date(notif.createdAt).toLocaleString()}
                           </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles = {
    container: {
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        fontSize: "28px",
        marginBottom: "20px",
        color: "#333",
    },
    list: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },
    notifCard: {
        background: "#f5f5f5",
        padding: "15px",
        borderRadius: "8px",
        borderLeft: "4px solid #007bff",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    message: {
        margin: "0 0 8px 0",
        fontSize: "15px",
        color: "#333",
    },
    time: {
        fontSize: "12px",
        color: "#888",
    },
    empty: {
        textAlign: "center",
        color: "#999",
        paddingTop: "40px",
        fontSize: "16px",
    },
    error: {
        color: "#d32f2f",
        padding: "12px",
        background: "#ffebee",
        borderRadius: "4px",
    },
};

export default Notifications;

