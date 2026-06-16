import API from "../api/axios";

// ================= GET FOLLOWERS =================

export const getFollowers = async () => {

    const response = await API.get(
        "/follow/followers"
    );

    return response.data;
};

// ================= GET FOLLOWING =================

export const getFollowing = async () => {

    const response = await API.get(
        "/follow/following"
    );

    return response.data;
};

// ================= FOLLOW USER =================

export const followUser = async (userId) => {

    const response = await API.post(
        `/follow/${userId}`
    );

    return response.data;
};

// ================= UNFOLLOW USER =================

export const unfollowUser = async (userId) => {

    const response = await API.post(
        `/follow/${userId}`
    );

    return response.data;
};