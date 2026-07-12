import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock } from "lucide-react"; // Make sure to install: npm install lucide-react
import API, { setAuthToken } from "../services/api";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await API.post("auth/login/", {
        email,
        password,
      });

      const access = res.data.tokens.access;
      const refresh = res.data.tokens.refresh;

      // ✅ Store tokens properly
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      setAuthToken(access);

      const me = await API.get("auth/profile/");

      onLogin(me.data);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      console.log("STATUS:", err.response?.status);
      console.log("DATA:", err.response?.data);
      console.log("FULL ERROR:", err.response);
      alert("Login failed: Check credentials");
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="flex justify-center items-center min-h-screen w-full bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
    >
      <div className="relative w-100 h-112.5 bg-transparent border-2 border-white/50 rounded-2xl backdrop-blur-[15px] flex justify-center items-center text-white">

        <div className="w-full px-10">
          <form onSubmit={login}>
            <h2 className="text-4xl font-bold text-center text-white mb-8">Login</h2>

            {/* Username Input */}
            <div className="relative my-8 w-full border-b-2 border-white">
              <span className="absolute right-2 top-0 text-white text-xl">
                <User size={20} />
              </span>
              <input
                type="email"
                required
                className="w-full h-12 bg-transparent border-none outline-none text-white text-lg px-2 pr-9 peer placeholder-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                autoComplete="email"
              />
              <label className="absolute left-1 top-1/2 -translate-y-1/2 text-white text-base transition-all duration-500 pointer-events-none 
                peer-focus:-top-1 peer-focus:text-sm
                peer-valid:-top-1 peer-valid:text-sm
                peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:text-sm"
              >
                Email
              </label>
            </div>

            {/* Password Input */}
            <div className="relative my-8 w-full border-b-2 border-white">
              <span className="absolute right-2 top-0 text-white text-xl">
                <Lock size={20} />
              </span>
              <input
                type="password"
                required
                className="w-full h-12 bg-transparent border-none outline-none text-white text-lg px-2 pr-9 peer placeholder-transparent"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
              />
              <label className="absolute left-1 top-1/2 -translate-y-1/2 text-white text-base transition-all duration-500 pointer-events-none 
                peer-focus:-top-1 peer-focus:text-sm
                peer-valid:-top-1 peer-valid:text-sm
                peer-[:not(:placeholder-shown)]:-top-1 peer-[:not(:placeholder-shown)]:text-sm"
              >
                Password
              </label>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex justify-center text-sm text-white mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-white" /> Remember me
              </label>
            </div>

            {/* Login Button */}
            <button
              disabled={loading}
              className={`w-full h-10 rounded-full bg-white border-none outline-none cursor-pointer text-base font-semibold text-slate-900 transition-opacity
                ${loading ? "opacity-70 cursor-not-allowed" : "hover:opacity-90"}
              `}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>


          </form>
        </div>
      </div>
    </section>
  );
}