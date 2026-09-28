import { useState } from "react";
import { loginUser } from "../api/authApi";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const data = await loginUser(formData);

      localStorage.setItem("token", data.token);

      window.location.href = "/";
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Login failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">

      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">

        <h1 className="text-3xl font-bold">
          Welcome Back
        </h1>

        <p className="mt-2 text-slate-400">
          Login to your CodePulse account
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="text-sm text-slate-300">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">
              Password
            </label>

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold hover:bg-blue-500"
          >
            Login
          </button>

        </form>

        {error && (
          <p className="mt-5 text-red-400">
            {error}
          </p>
        )}

      </div>

    </div>
  );
}

export default Login;