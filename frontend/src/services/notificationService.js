import API from "../api/axios";

/**
 * Fetch all notifications for the authenticated user
 * @returns {Promise<Array>} List of notifications
 */
export const getNotifications = async () => {
    try {
        const response = await API.get("/notifications");
        return response.data;
    } catch (error) {
        console.error("Failed to fetch notifications:", error.message);
        throw error;
    }
};