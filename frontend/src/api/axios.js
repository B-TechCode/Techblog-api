import axios from "axios";

// ================= BASE URL =================

const BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:8080/api";

// ================= AXIOS INSTANCE =================

const API = axios.create({

    baseURL: BASE_URL,

    timeout: 15000,

    headers: {
        "Content-Type": "application/json"
    }

});

// ================= REQUEST INTERCEPTOR =================

API.interceptors.request.use(

    (config) => {

        const token = localStorage.getItem("token");

        // ✅ ADD TOKEN
        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;
        }

        return config;
    },

    (error) => {

        console.error("REQUEST ERROR:", error);

        return Promise.reject(error);
    }
);

// ================= RESPONSE INTERCEPTOR =================

API.interceptors.response.use(

    (response) => response,

    (error) => {

        // ✅ BETTER ERROR MESSAGE

        const message =

            error?.response?.data?.message ||

            error?.response?.data ||

            error?.message ||

            "Something went wrong";

        console.error("API ERROR:", message);

        // ================= SESSION EXPIRED =================

        if (
            error.response &&
            error.response.status === 401
        ) {

            alert("Session expired. Please login again.");

            // ✅ CLEAR STORAGE

            localStorage.removeItem("token");

            localStorage.removeItem("user");

            localStorage.removeItem("profileImage");

            // ✅ REDIRECT LOGIN

            window.location.href = "/";
        }

        return Promise.reject(error);
    }
);

export default API;