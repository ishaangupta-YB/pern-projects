import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("/auth/login", { email, password });
     
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("token", token); 
        window.location.reload()
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data.message ||
            error.response?.data.error ||
            "An error occurred"
        );
      } else {
        setError("An error occurred");
      }
    }
  };

  const handleNavigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xs">
        <h2 className="mb-6 text-3xl font-bold text-center text-gray-900">
          Login
        </h2>
        {error && (
          <div className="p-3 mb-4 text-center text-red-500 border border-red-400 rounded">
            {error}
          </div>
        )}
        <div className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full px-3 py-2 mb-3 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
            <button
              className="inline-block text-sm font-bold text-blue-500 align-baseline hover:text-blue-800"
              type="button"
              onClick={handleNavigateToRegister}
            >
              Need an account? Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
