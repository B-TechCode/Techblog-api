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

                const data = await searchUsers(keyword);

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
                className="search-input"
                type="text"
                placeholder="Search people..."
                value={keyword}
                onChange={(e) =>
                    setKeyword(e.target.value)
                }
                style={styles.input}
            />

            {/* SHOW DROPDOWN ONLY WHEN USERS EXIST */}

            {users.length > 0 && (

                <ul style={styles.list}>

                    {users.map((user) => (

                        <li
                            key={user.id}
                            style={styles.listItem}
                        >

                            <span style={styles.userName}>
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

            )}

        </div>

    );
};

export default SearchUsers;

// ================= STYLES =================

const styles = {

    container: {

        position: "relative",

        width: "100%",

        maxWidth: "240px",

        minWidth: "170px",

        flexShrink: 1
    },

    input: {

        width: "100%",

        height: "40px",

        padding: "0 14px",

        borderRadius: "10px",

        border: "1px solid rgba(255,255,255,0.08)",

        outline: "none",

        background: "#232738",

        color: "#ffffff",

        fontSize: "14px",

        boxSizing: "border-box",

        transition: ".3s",

        minWidth: 0
    },



    list: {

        position: "absolute",

        top: "46px",

        left: 0,

        width: "100%",

        minWidth: "220px",

        listStyle: "none",

        margin: 0,

        padding: "8px",

        borderRadius: "12px",

        background: "#1b2233",

        boxShadow: "0 12px 30px rgba(0,0,0,.35)",

        maxHeight: "300px",

        overflowY: "auto",

        zIndex: 999
    },



    listItem: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        padding: "10px",

        marginBottom: "8px",

        borderRadius: "8px",

        background: "rgba(255,255,255,.05)"
    },

    userName: {

        color: "white",

        flex: 1,

        marginRight: "10px",

        whiteSpace: "nowrap",

        overflow: "hidden",

        textOverflow: "ellipsis",

        fontSize: "14px"
    },



    followBtn: {

        border: "none",

        borderRadius: "8px",

        padding: "6px 12px",

        minWidth: "76px",

        cursor: "pointer",

        color: "white",

        fontWeight: "600",

        background:
            "linear-gradient(135deg,#2563eb,#38bdf8)",

        flexShrink: 0
    }
};