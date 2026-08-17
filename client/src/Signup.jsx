import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

export default function Signup() {
  const { signUp } = useAuth(); const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" }); const [message, setMessage] = useState(""); const [error, setError] = useState("");
  async function submit(event) { event.preventDefault(); setError(""); try { await signUp(form); setMessage("Account created. You can now sign in."); setTimeout(() => navigate("/login"), 600); } catch (err) { setError(err.message); } }
  return <section className="auth-card"><h1>Sign up</h1><form onSubmit={submit}>
    <label>Name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
    <label>Email<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></label>
    <label>Password<input type="password" minLength="6" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></label>
    {message && <p className="success">{message}</p>}{error && <p className="error">{error}</p>}<button>Create account</button>
  </form><p>Already registered? <Link to="/login">Sign in</Link></p></section>;
}
