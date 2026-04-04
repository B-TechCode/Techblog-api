import { useEffect, useState } from "react";
import API from "../api/axios";

const Profile = ({ goToDashboard }) => {

    const [user, setUser] = useState({});
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.get("/users/test", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUser(res.data);

            const postRes = await API.get("/posts");

            const myPosts = postRes.data.filter(
                p => p.user?.email === res.data.email
            );

            setPosts(myPosts);

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            padding: "20px",
            color: "white"
        }}>

            <button onClick={goToDashboard}>⬅ Back</button>

            <h2>👤 My Profile</h2>

            <p><b>Email:</b> {user.email}</p>

            <h3>My Posts</h3>

            {posts.map(post => (
                <div key={post.id} style={{
                    background: "rgba(255,255,255,0.1)",
                    padding: "15px",
                    margin: "10px 0",
                    borderRadius: "10px"
                }}>
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                </div>
            ))}

        </div>
    );
};

export default Profile;