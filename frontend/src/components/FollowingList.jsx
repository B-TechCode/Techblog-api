
//create simple following list component using existing follow service and useEffect only
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

            console.error("Failed to fetch following:", err);
        }
    };

    return (

        <div style={container}>

            <h2 style={title}>Following</h2>

            {following.length === 0 ? (

                <p style={emptyText}>Not following anyone yet.</p>

            ) : (

                <ul style={list}>

                    {following.map((user) => (

                        <li key={user.id} style={listItem}>

                            {user.username}</li>

                    ))}

                </ul>

            )}

        </div>
    );
};

export default FollowingList;









