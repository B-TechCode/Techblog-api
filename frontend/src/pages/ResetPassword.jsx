import { useState } from "react";
import { resetPassword } from "../services/authService";

const ResetPassword = ({ goToLogin }) => {

    const [form, setForm] = useState({
        otp: "",
        newPassword: ""
    });

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await resetPassword({
                email: localStorage.getItem("resetEmail"),
                otp: form.otp,
                newPassword: form.newPassword
            });

            localStorage.removeItem("resetEmail");

            alert("Password reset successful");

            goToLogin();

        } catch (err) {

            alert(
                err.response?.data ||
                "Password reset failed"
            );
        }
    };

    return (

        <div className="app-container">

            <div className="card">

                <h2>Reset Password</h2>

                <form onSubmit={handleSubmit}>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="input"
                        value={form.otp}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                otp: e.target.value
                            })
                        }
                    />

                    <input
                        type="password"
                        placeholder="New Password"
                        className="input"
                        value={form.newPassword}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                newPassword: e.target.value
                            })
                        }
                    />

                    <button className="btn">
                        Reset Password
                    </button>

                </form>

            </div>

        </div>
    );
};

export default ResetPassword;