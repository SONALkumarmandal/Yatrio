import { createContext, useContext, useEffect, useState } from "react";
import * as authApi from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("yatrio_user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("yatrio_token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const me = await authApi.getMe();
        setUser(me);
        localStorage.setItem("yatrio_user", JSON.stringify(me));
      } catch (err) {
        console.warn("Session expired or invalid:", err.message);
        setToken(null);
        setUser(null);
        localStorage.removeItem("yatrio_token");
        localStorage.removeItem("yatrio_user");
      } finally {
        setLoading(false);
      }
    }
    verifyUser();
  }, [token]);

  async function login(email, password) {
    const data = await authApi.login({ email, password });
    if (data?.access_token) {
      setToken(data.access_token);
      setUser(data.user);
      localStorage.setItem("yatrio_token", data.access_token);
      localStorage.setItem("yatrio_user", JSON.stringify(data.user));
    }
    return data;
  }

  async function register({ email, username, fullName, password }) {
    await authApi.register({ email, username, fullName, password });
    return login(email, password);
  }

  async function logout() {
    await authApi.logout();
    setToken(null);
    setUser(null);
  }

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
