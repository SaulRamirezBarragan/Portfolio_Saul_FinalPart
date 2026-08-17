import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./auth";

export default function Login() {
  const { signIn, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const result = await signIn(form);
      const destination = result.user.role === "admin" ? "/admin" : "/";
      navigate(destination);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="auth-card">
      <h1>Sign in</h1>

      <form onSubmit={submit}>
        <label>
          Email
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </label>

        <label>
          Password
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </label>

        {error && <p className="error">{error}</p>}
        <button disabled={loading}>Sign in</button>
      </form>

      <p>
        New user? <Link to="/signup">Create an account</Link>
      </p>
    </section>
  );
}
