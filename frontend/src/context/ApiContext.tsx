import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser, logoutUser } from "../api/auth";
import { clearAccessToken } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../components/ScreenLoader";
import { showError } from "../utils/toast";

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
    logout: async () => {
      try {
        await logoutUser();
      } catch (error) {
        showError(error)
      }
      clearAccessToken();
      setUser(null);
      navigate("/");
    },
  };

  if(loading) {
    return <FullScreenLoader text="Loading..."/>
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must used within AuthProvider");
  return ctx;
}
