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
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0f] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] via-[#1a0a2e] to-[#0a0a0f]" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />

      <form
        onSubmit={handleLogin}
        className="relative z-10 w-full max-w-md bg-[#0f0f1a]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-2">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Admin Portal
            </span>
          </h2>
          <p className="text-gray-400 text-sm">
            Sign in to manage your portfolio
          </p>
        </div>

        {/* Email */}
        <div className="mb-5">
          <label className="text-gray-300 text-sm mb-2 block font-medium">
            Email
          </label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus-within:border-blue-500/50 transition-colors">
            <Mail className="text-blue-400 mr-3" size={20} />
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
        <div className="mb-6">
          <label className="text-gray-300 text-sm mb-2 block font-medium">
            Password
          </label>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus-within:border-purple-500/50 transition-colors">
            <Lock className="text-purple-400 mr-3" size={20} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
              placeholder="Enter password"
              required
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg font-semibold text-white bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-6">
          🔒 Restricted access • Admin only
        </p>
      </form>
    </div>
  );
};

export default SignIn;
