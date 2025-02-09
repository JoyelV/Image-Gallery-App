import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginImage from '../assets/login.png';
import axiosInstance from "../utility/axiosInstance";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      navigate("/gallery");
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-2 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-8 w-96 flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-center mb-6">Login to Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
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
            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
              Login
            </button>
          </form>
          <p className="text-end mt-4">
            <a href="/forgot-password" className="text-blue-500">Forgot Password?</a>
          </p>

          <p className="text-center mt-4">
            Don't have an account? <a href="/register" className="text-blue-500">Sign Up</a>
          </p>
        </div>
        <div className="hidden md:block">
          <img src={loginImage} alt="Login" className="w-96 h-96 object-cover" />
        </div>
      </div>
    </div>
  );
}

export default Login;
