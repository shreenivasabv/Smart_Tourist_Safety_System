import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        form
      );

      localStorage.setItem("token", res.data.token);

      navigate("/");
    } catch (err) {
      setError("Invalid Email or Password");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-xl w-96"
      >

        <h2 className="text-3xl font-bold mb-6 text-center">
          Admin Login
        </h2>

        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full border rounded p-3 mb-4"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full border rounded p-3 mb-4"
          required
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white w-full py-3 rounded"
        >
          Login
        </button>

        <div className="text-center mt-4">

          <Link
            to="/forgot-password"
            className="text-blue-600"
          >
            Forgot Password?
          </Link>

        </div>

      </form>

    </div>
  );
}

export default Login;