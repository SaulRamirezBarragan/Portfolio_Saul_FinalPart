import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("portfolio-user")); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) localStorage.setItem("portfolio-user", JSON.stringify(user));
    else localStorage.removeItem("portfolio-user");
  }, [user]);

  const signIn = async (credentials) => {
    setLoading(true);
    try { const result = await api("/auth/signin", { method: "POST", body: JSON.stringify(credentials) }); setUser(result.user); return result; }
    finally { setLoading(false); }
  };
  const signUp = (data) => api("/api/users", { method: "POST", body: JSON.stringify(data) });
  const signOut = async () => { await api("/auth/signout"); setUser(null); };

  const value = useMemo(() => ({ user, loading, signIn, signUp, signOut }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() { return useContext(AuthContext); }
