const Navbar = ({ onLogout }) => {
    return (
        <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "15px 30px",
            backgroundColor: "#333",
            color: "white"
        }}>

            {/* 🔥 LEFT SIDE */}
            <h2 style={{ margin: 0 }}>TechBlog</h2>

            {/* 🔥 RIGHT SIDE */}
            <button
                onClick={onLogout}
                style={{
                    padding: "8px 15px",
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer"
                }}
            >
                Logout
            </button>

        </div>
    );
};

export default Navbar;