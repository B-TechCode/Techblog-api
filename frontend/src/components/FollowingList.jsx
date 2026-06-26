import React, { useEffect, useState } from "react";
import { getFollowing } from "../services/followService";

const FollowingList = ({ userId }) => {

    const [following, setFollowing] = useState([]);

    useEffect(() => {

        fetchFollowing();

    }, [userId]);

    // ================= FETCH FOLLOWING =================

    const fetchFollowing = async () => {

        try {

            const data = await getFollowing(userId);

            setFollowing(data);

        } catch (err) {

            console.error(
                "Failed to fetch following:",
                err
            );
        }
    };

    return (

        <div style={styles.container}>

            <h2 style={styles.title}>
                Following
            </h2>

            {following.length === 0 ? (

                <p style={styles.noFollowing}>
                    Not following anyone yet.
                </p>

            ) : (

                <ul style={styles.list}>

                    {following.map((user) => (

                        <li
                            key={user.id}
                            style={styles.listItem}
                        >

                            <span>
                                {user.name}
                            </span>

                        </li>

                    ))}

                </ul>

            )}

        </div>

    );
};

export default FollowingList;

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

        alignItems: "center",

        padding: "10px",

        marginBottom: "10px",

        borderRadius: "10px",

        background: "rgba(255,255,255,0.04)",

        color: "white"
    },

    noFollowing: {

        color: "rgba(255,255,255,0.7)"
    }
};