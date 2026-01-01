// Signup screen — create account + email verification

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

export default function Signup() {
  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");

  // handle signup request
  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setInfo("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // redirect after email confirmation (dev url)
        emailRedirectTo: "http://localhost:5173",
      },
    });

    setLoading(false);

    // handle errors
    if (error) {
      if (error.message.includes("already registered")) {
        setInfo(
          "⚠️ This email is already registered — try logging in instead."
        );
        toast.error("Account already exists");
      } else {
        toast.error(error.message);
      }
      return;
    }

    setInfo(
      "🎉 Account created! Check your email and confirm before logging in."
    );
    toast.success("Check your inbox!");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl bg-white shadow-md space-y-5">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Create your account 🚀</h1>
        <p className="text-gray-500 text-sm mt-1">
          Verify your email before logging in.
        </p>
      </div>

      {/* INFO MESSAGE */}
      {info && (
        <div className="p-3 rounded-lg bg-blue-50 text-blue-700 text-sm">
          {info}
        </div>
      )}

      {/* FORM */}
      <form onSubmit={handleSignup} className="space-y-3">
        <input
          type="email"
          className="border p-2 w-full rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          className="border p-2 w-full rounded-lg"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 transition text-white px-3 py-2 rounded-lg w-full disabled:opacity-60">
          {loading ? "Creating..." : "Sign Up"}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
