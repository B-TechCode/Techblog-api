import React, { useEffect, useState } from "react";

import {
    getFollowers,
    followUser
} from "../services/followService";

const FollowersList = ({ userId }) => {

    const [followers, setFollowers] = useState([]);
    const [followingUsers, setFollowingUsers] = useState({});

    useEffect(() => {

        fetchFollowers();

    }, [userId]);

    // ================= FETCH FOLLOWERS =================

    const fetchFollowers = async () => {

        try {

            const data = await getFollowers(userId);

            setFollowers(data);

        } catch (err) {

            console.error(
                "Failed to fetch followers:",
                err
            );
        }
    };

    // ================= HANDLE FOLLOW =================

    const handleFollow = async (userId) => {

        try {

            await followUser(userId);

            setFollowingUsers((prev) => ({
                ...prev,
                [userId]: true
            }));

            fetchFollowers();

        } catch (err) {

            console.error(
                "Failed to follow user:",
                err
            );
        }
    };

    return (

        <div style={styles.container}>

            <h2 style={styles.title}>
                Followers
            </h2>

            {followers.length === 0 ? (

                <p style={styles.noFollowers}>
                    No followers yet.
                </p>

            ) : (

                <ul style={styles.list}>

                    {followers.map((follower) => (

                        <li
                            key={follower.id}
                            style={styles.listItem}
                        >

                            <span>
                                {follower.name}
                            </span>

                            <button
                                onClick={() =>
                                    handleFollow(follower.id)
                                }
                                style={followBtn}
                            >
                                {followingUsers[follower.id]
                                    ? "Following"
                                    : "Follow"}
                            </button>

                        </li>

                    ))}

                </ul>

            )}

        </div>

    );

};   // ✅ THIS WAS MISSING

export default FollowersList;

// ================= STYLES =================

const styles = {

    container: {

        marginTop: "20px",

        padding: "15px",

        borderRadius: "12px",

        background: "rgba(255,255,255,0.05)"
    },

    title: {

        fontSize: "18px",

        marginBottom: "12px",

        color: "white"
    },

    list: {

        listStyle: "none",

        padding: 0,

        margin: 0
    },

    listItem: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        padding: "10px",

        marginBottom: "10px",

        borderRadius: "10px",

        background: "rgba(255,255,255,0.04)"
    },

    noFollowers: {

        color: "rgba(255,255,255,0.7)",

        textAlign: "center",

        padding: "20px"
    }
};

const followBtn = {

    padding: "6px 12px",

    border: "none",

    borderRadius: "8px",

    background: "linear-gradient(135deg, #2563eb, #38bdf8)",

    color: "white",

    cursor: "pointer",

    fontWeight: "600"
};