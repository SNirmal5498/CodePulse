import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useProfile } from "./hooks/useProfile";
import { logoutUser } from "./api/authApi";

function Home() {
  const { data, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading your profile...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400">
            Unable to load profile
          </h1>

          <p className="mt-2 text-slate-400">
            Please login again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <h1 className="text-2xl font-bold">
            CodePulse
          </h1>

          <button
            onClick={async () => {
            try {
            await logoutUser();
            window.location.href = "/login";
            } catch (err) {
              console.error("Logout failed", err);
            }
            }}
            className="rounded-lg bg-red-600 px-4 py-2 font-semibold hover:bg-red-500"
          >
            Logout
          </button>

        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">

        <h2 className="text-3xl font-bold">
          Welcome, {data.name} 👋
        </h2>

        <p className="mt-2 text-slate-400">
          Developer Productivity & Career Intelligence Platform
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Name
            </p>

            <p className="mt-2 text-xl font-semibold">
              {data.name}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Email
            </p>

            <p className="mt-2 text-xl font-semibold break-all">
              {data.email}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <p className="text-sm text-slate-400">
              Role
            </p>

            <p className="mt-2 text-xl font-semibold">
              {data.role}
            </p>
          </div>

        </div>

      </main>

    </div>
  );
}

function App() {
  return (
    <Routes>

      
      <Route
        path="/"
        element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }
      />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  );
}

export default App;