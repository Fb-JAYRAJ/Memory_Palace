// Login screen — email + password auth

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // handle login request
  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    // handle auth errors nicely
    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        toast.error(
          "Invalid credentials — check email/password or create an account."
        );
      } else if (error.message.includes("Email not confirmed")) {
        toast.error("Please confirm your email first.");
      } else {
        toast.error(error.message);
      }
      return;
    }

    toast.success("Welcome back! 🎉");
    navigate("/");
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 rounded-2xl bg-white shadow-md space-y-5">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back 👋</h1>
        <p className="text-gray-500 text-sm mt-1">
          Log in to access your Memory Palace.
        </p>
      </div>

      {/* FORM */}
      <form onSubmit={handleLogin} className="space-y-3">
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
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-3 py-2 rounded-lg w-full disabled:opacity-60">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-sm text-center">
        No account?{" "}
        <Link to="/signup" className="text-blue-600 font-medium">
          Create one
        </Link>
      </p>
    </div>
  );
}
