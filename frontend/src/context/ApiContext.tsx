import { createContext, useContext, useEffect, useState } from "react";
import { fetchUser, logoutUser } from "../api/auth";
import { clearAccessToken } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../components/ScreenLoader";
import { showError } from "../utils/toast";
import type { Role, User } from "../types/authtype";
import { getErrorMessage } from "../utils/getErrorMessage";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  role: Role | null;
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
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
        showError(getErrorMessage(error))
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
