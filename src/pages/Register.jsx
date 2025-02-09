import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from "../assets/login.png";
import axiosInstance from "../utility/axiosInstance";

function Register() {
  const [form, setForm] = useState({ username: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      const response = await axiosInstance.post("/auth/send-otp", { email: form.email });
      console.log(response);
      setOtpSent(true);
      alert("OTP sent to your email. Please check and enter it.");
    } catch (error) {
      alert(error.response?.data?.msg || "Error sending OTP");
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/auth/verify-otp", { email: form.email, otp, form });
      alert("Registration Successful!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.msg || "Invalid OTP. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-2 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8 w-96 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-6">Sign up for an account</h2>
          
          {!otpSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded"
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 border border-gray-300 rounded"
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                className="w-full p-3 border border-gray-300 rounded"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full p-3 border border-gray-300 rounded"
                onChange={handleChange}
                required
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full p-3 border border-gray-300 rounded"
                onChange={handleChange}
                required
              />
              <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
                Get OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpVerify} className="space-y-4">
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                className="w-full p-3 border border-gray-300 rounded"
                onChange={(e) => setOtp(e.target.value)}
                required
              />
              <button type="submit" className="w-full bg-green-500 text-white p-3 rounded hover:bg-green-600">
                Verify OTP & Register
              </button>
            </form>
          )}

          <p className="text-center mt-4">
            Already have an account? <a href="/" className="text-blue-500">Sign In</a>
          </p>
        </div>
        <div className="hidden md:block">
          <img src={loginImage} alt="Register" className="w-96 h-106 object-cover" />
        </div>
      </div>
    </div>
  );
}

export default Register;