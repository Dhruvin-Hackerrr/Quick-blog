import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser, loginUser, logoutUser, registerUser } from "../api/auth";
import { clearAccessToken, setAccessToken } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import type { registerFormData } from "../validations/authSchema";

const AuthContext = createContext(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetchUser();

        if (!cancelled) {
          setUser(response.data.data);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const values = {
    user,
    setUser,
    role: user?.role ?? null,
    isAuthenticated: !!user,
    loading,
    userRegister: async (data : registerFormData) => {
      try {
        await registerUser(data);
        const user = (
          await loginUser({ email: data.email, password: data.password })
        ).data.data;
        setAccessToken(user.accessToken);
        setUser(user.safeUser);
        navigate("/post")
      } catch (error) {
        console.log(error);
      }
    },
    logout: async () => {
      try {
        await logoutUser();
      } catch (err) {
        console.log("Logout API failed, continuing cleanup", err);
      }
      clearAccessToken();
      setUser(null);
      navigate("/");
    },
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must used within AuthProvider");
  return ctx;
}
