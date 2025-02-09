import { useState } from "react";
import axiosInstance from "../utility/axiosInstance";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [step, setStep] = useState(1);
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        try {
            const trimmedEmail = email.trim();
            if (!trimmedEmail) {
                alert("Please enter a valid email");
                return;
            }
            const response = await axiosInstance.post("/auth/forgot-password", { email: trimmedEmail });
            console.log(response);
            alert("OTP sent to your email");
            setStep(2);
        } catch (error) {
            alert(error.response?.data?.msg || "Something went wrong");
        }
    };

    const handleResetPassword = async () => {
        if (!otp.trim() || !newPassword.trim()) {
            alert("OTP and new password are required!");
            return;
        }
        try {
            await axiosInstance.post("/auth/reset-password", { email, otp, newPassword });
            alert("Password reset successfully");
            navigate("/");
        } catch (error) {
            alert(error.response?.data?.msg || "Failed to reset password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 w-96 bg-white shadow-lg rounded-lg">
                <h2 className="text-2xl font-semibold text-center mb-6">
                    {step === 1 ? "Forgot Password" : "Reset Password"}
                </h2>

                {step === 1 ? (
                    <>
                        <input
                            type="email"
                            value={email}
                            placeholder="Enter your email"
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <button
                            onClick={handleSendOtp}
                            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
                        >
                            Send OTP
                        </button>
                    </>
                ) : (
                    <>
                        <input
                            type="text"
                            value={otp}
                            placeholder="Enter OTP"
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                            onChange={(e) => setOtp(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            value={newPassword}
                            placeholder="Enter new password"
                            className="w-full p-3 border border-gray-300 rounded mb-4"
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <button
                            onClick={handleResetPassword}
                            className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600"
                        >
                            Reset Password
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;
