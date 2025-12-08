"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "viewer", // default role
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form), // includes role 
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed");
        return;
      }

      router.push("/login"); // redirect after success 
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[--color-card] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4 text-[--color-primary]">
        Register
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          className="w-full p-2 rounded bg-black text-white border border-gray-600"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 rounded bg-black text-white border border-gray-600"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 rounded bg-black text-white border border-gray-600"
          required
        />

        {/* Role Selection */}
        <div>
          <label className="block text-sm text-gray-400 mb-1">Select Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-2 rounded bg-black text-white border border-gray-600"
          >
            <option value="viewer">Viewer</option>
            <option value="critic">Critic</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        <button
          type="submit"
          className="w-full bg-[--color-primary] hover:bg-purple-600 text-white font-bold py-2 rounded"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}
