import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, getMe, loginUser, registerUser } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { token, user: loggedInUser } = await loginUser(email, password);
    setToken(token);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const register = async (name, email, password) => {
    const { token, user: newUser } = await registerUser(name, email, password);
    setToken(token);
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, setUser, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
