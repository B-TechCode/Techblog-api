import { useState } from "react";
import { forgotPassword } from "../services/authService";

const ForgotPassword = ({ goToResetPassword }) => {

    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await forgotPassword(email);

            localStorage.setItem(
                "resetEmail",
                email
            );

            alert("OTP sent to your email");

            goToResetPassword();

        } catch (err) {

            alert(
                err.response?.data ||
                "Failed to send OTP"
            );
        }
    };

    return (

        <div className="app-container">

            <div className="card">

                <h2>Forgot Password</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        className="input"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <button className="btn">
                        Send OTP
                    </button>

                </form>

            </div>

        </div>
    );
};

export default ForgotPassword;