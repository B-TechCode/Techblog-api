import React, { useEffect, useState } from "react";

import { searchUsers } from "../services/authService";

import { followUser } from "../services/followService";

const SearchUsers = () => {

    const [keyword, setKeyword] = useState("");

    const [users, setUsers] = useState([]);

    // ================= HANDLE FOLLOW =================

    const handleFollow = async (userId) => {

        try {

            await followUser(userId);

            alert("User followed successfully");

        } catch (error) {

            console.error(
                "Failed to follow user:",
                error
            );
        }
    };

    // ================= SEARCH USERS =================

    useEffect(() => {

        const fetchUsers = async () => {

            if (keyword.trim() === "") {

                setUsers([]);

                return;
            }

            try {

                const data =
                    await searchUsers(keyword);

                setUsers(data);

            } catch (err) {

                console.error(err);
            }
        };

        fetchUsers();

    }, [keyword]);

    return (

        <div style={styles.container}>

            <input
                type="text"
                placeholder="Search users..."
                value={keyword}
                onChange={(e) =>
                    setKeyword(e.target.value)
                }
                style={styles.input}
            />

            <ul style={styles.list}>

                {users.map((user) => (

                    <li
                        key={user.id}
                        style={styles.listItem}
                    >

                        <span>
                            {user.name}
                        </span>

                        <button
                            onClick={() =>
                                handleFollow(user.id)
                            }
                            style={styles.followBtn}
                        >
                            Follow
                        </button>

                    </li>

                ))}

            </ul>

        </div>
    );
};

export default SearchUsers;

// ================= STYLES =================

const styles = {

    container: {

        width: "100%",

        maxWidth: "500px",

        margin: "20px auto",

        padding: "20px",

        borderRadius: "16px",

        background:
            "rgba(255,255,255,0.06)",

        backdropFilter: "blur(12px)"
    },

    input: {

        width: "100%",

        padding: "12px",

        borderRadius: "10px",

        border: "none",

        outline: "none",

        marginBottom: "16px",

        fontSize: "14px"
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

        padding: "10px 14px",

        background:
            "rgba(255,255,255,0.05)",

        borderRadius: "10px",

        marginBottom: "10px",

        color: "white"
    },

    followBtn: {

        padding: "6px 12px",

        borderRadius: "8px",

        border: "none",

        background:
            "linear-gradient(135deg, #2563eb, #38bdf8)",

        color: "white",

        cursor: "pointer",

        fontWeight: "600"
    }
};