import React, { useState } from "react";

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          onLogin();
        } else {
          alert("Invalid email or password");
        }
      });
  };

  return (
    <div className="min-h-screen bg-[#f7f5f0] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
        
        {/* Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-semibold tracking-tight text-[#1e3a8a]">
            RVU Student Portal
          </h1>
          <p className="mt-3 text-sm uppercase tracking-widest text-gray-500">
            Faculty Access Only
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="faculty@rvu.edu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
                       bg-white shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Password */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300
                       bg-white shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#1e3a8a] text-white py-3 rounded-xl
                     font-medium tracking-wide
                     hover:bg-[#1b3375] transition"
        >
          Sign In
        </button>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center mt-8 italic">
          *This system is intended strictly for teaching staff*
        </p>
      </div>
    </div>
  );
}

export default Login;
