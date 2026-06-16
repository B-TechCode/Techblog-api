import API from "../api/axios";

// ================= UPDATE PROFILE =================

export const updateProfile = async (userData) => {

    try {

        const response = await API.put(
            "/users/profile",
            userData
        );

        return response.data;

    } catch (error) {

        console.error(
            "Profile update failed:",
            error
        );

        throw error;
    }
};