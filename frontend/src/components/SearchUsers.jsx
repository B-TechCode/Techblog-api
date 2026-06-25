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
                placeholder="Search people..."
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

                       <span
                           style={{
                               maxWidth: "150px",
                               whiteSpace: "nowrap",
                               overflow: "hidden",
                               textOverflow: "ellipsis"
                           }}
                       >
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

        position: "relative",

        width: "260px"
    },

    input: {

        width: "100%",

        height: "42px",

        padding: "0 14px",

        borderRadius: "10px",

        border: "1px solid rgba(255,255,255,0.08)",

        outline: "none",

        background: "#1f2433",

        color: "white",

        fontSize: "14px",

        boxSizing: "border-box"
    },


    list: {

        position: "absolute",

        top: "48px",

        left: 0,

        width: "100%",

        listStyle: "none",

        padding: "8px",

        margin: 0,

        borderRadius: "12px",

        background: "#1b2233",

        boxShadow: "0 10px 30px rgba(0,0,0,.35)",

        maxHeight: "320px",

        overflowY: "auto",

        zIndex: 999
    },



    listItem: {

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        padding: "10px 12px",

        borderRadius: "10px",

        marginBottom: "8px",

        background: "rgba(255,255,255,0.05)",

        color: "white"
    },



    followBtn: {

        padding: "6px 14px",

        borderRadius: "8px",

        border: "none",

        background:
            "linear-gradient(135deg,#2563eb,#38bdf8)",

        color: "white",

        cursor: "pointer",

        fontWeight: "600",

        fontSize: "13px"
    },
};