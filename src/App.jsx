import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { supabase } from "./lib/supabase";
import "./styles/theme.css";

// Pages
import Rooms from "./pages/rooms/Rooms.jsx";
import Cards from "./pages/cards/Cards.jsx";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup.jsx";

export default function App() {
  const [user, setUser] = useState(null); // logged-in user
  const [loading, setLoading] = useState(true); // initial auth check

  const navigate = useNavigate();

  // 🔐 Check current session + listen for auth changes
  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
      setLoading(false);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);

      if (event === "SIGNED_IN") toast.success("Signed in 🎯");
    });

    // cleanup listener
    return () => subscription.unsubscribe();
  }, [navigate]);

  // 🔓 Logout
  async function logout() {
    await supabase.auth.signOut();
    toast.success("Logged out");
  }

  // ⏳ Initial loader
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading your workspace…</p>
      </div>
    );

  return (
    <div className="min-h-screen app-bg">
      {/* HEADER — only visible when logged in */}
      {user && (
        <header className="sticky top-0 z-20 backdrop-blur bg-white/70 border-b shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
            {/* Brand */}
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-700 to-pink-600 bg-clip-text text-transparent">
                Memory Palace
              </h1>

              <p className="text-xs text-gray-600 mt-0.5">
                Master your knowledge — one card at a time
              </p>
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 active:scale-[.98] transition">
              Logout
            </button>
          </div>
        </header>
      )}

      {/* ROUTES */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected — fallback to login */}
          <Route path="/" element={user ? <Rooms /> : <Login />} />
          <Route path="/room/:id" element={user ? <Cards /> : <Login />} />

          {/* Catch-all */}
          <Route path="*" element={<Login />} />
        </Routes>
      </main>
    </div>
  );
}
