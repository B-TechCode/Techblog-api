import API from "../api/axios";

// ================= REGISTER =================

export const registerUser = async (data) => {

    const response = await API.post(
        "/users/register",
        data
    );

    return response.data;
};

// ================= VERIFY OTP =================

export const verifyOTP = async (data) => {

    const response = await API.post(
        "/users/verify",
        data
    );

    return response.data;
};

// ================= LOGIN =================

export const loginUser = async (data) => {

    const response = await API.post(
        "/users/login",
        data
    );

    // ================= SAVE TOKEN =================

    localStorage.setItem(
        "token",
        response.data.token
    );

    // ================= SAVE USER =================

    localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
    );

    return response.data;
};

// ================= LOGOUT =================

export const logoutUser = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    localStorage.removeItem("profileImage");
};

// ================= GET CURRENT USER =================

export const getCurrentUser = () => {

    const user = localStorage.getItem("user");

    return user
        ? JSON.parse(user)
        : null;
};

// ================= CHECK LOGIN =================

export const isAuthenticated = () => {

    return !!localStorage.getItem("token");
};

// create api method to search users by keyword using existing axios configuration only
export const searchUsers = async (keyword) => {
    const response = await API.get(`/users/search?keyword=${keyword}`);
    return response.data;
};