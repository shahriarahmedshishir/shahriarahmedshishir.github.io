import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Mail, Lock } from "lucide-react";

const SignIn = () => {
  const { signInUser } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInUser(email, password);
      navigate("/adminpanel");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-slate-900 to-pink-900/30 blur-3xl" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-slate-800/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          Admin Sign In
        </h2>

        {/* Email */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm mb-1 block">Email</label>
          <div className="flex items-center bg-slate-900 border border-purple-500/30 rounded-lg px-3">
            <Mail className="text-purple-400 mr-2" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent text-gray-200 py-2 focus:outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm mb-1 block">Password</label>
          <div className="flex items-center bg-slate-900 border border-purple-500/30 rounded-lg px-3">
            <Lock className="text-purple-400 mr-2" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-gray-200 py-2 focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg font-semibold text-white
            bg-gradient-to-r from-purple-500 to-pink-600
            hover:from-purple-600 hover:to-pink-700
            transition-all duration-300 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          Restricted access • Admin only
        </p>
      </form>
    </div>
  );
};

export default SignIn;
