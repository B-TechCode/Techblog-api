import API from "../api/axios";

// Register
export const registerUser = (data) => {
    return API.post("/users/register", data);
};

// Verify OTP
export const verifyOTP = (data) => {
    return API.post("/users/verify", data);
};

// Login
export const loginUser = (data) => {
    return API.post("/users/login", data);
};