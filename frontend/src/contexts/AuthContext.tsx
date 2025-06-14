/* eslint-disable react-hooks/exhaustive-deps */
import api from "@/services/api";
import { UserTypes } from "@/types/User";
import { useRouter } from "next/router";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import React, {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
} from "react";
import md5 from "md5";

interface AuthContextData {
  user: UserTypes | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  reloadUserData: () => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<UserTypes | null>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "eltonfintech.token": token } = parseCookies();
    if (token) {
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      reloadUserData();
    }
  }, []);

  async function reloadUserData() {
    try {
      setLoading(true);
      const response = await api.get("auth/profile");
      if (response) {
        const { user, token } = response.data;
        setCookie(undefined, "eltonfintech.token", token, {
          maxAge: 60 * 60 * 24 * 1,
          path: "/",
        });
        setUser(user);
      } else {
        throw new Error("backend error");
      }
    } catch {
      setUser(null);
      api.defaults.headers["Authorization"] = ``;
      destroyCookie(null, "eltonfintech.token");
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string): Promise<void> {
    try {
      const hashedPassword = md5(password);
      const response = await api.post("/auth/login", {
        email,
        password: hashedPassword,
      });
      const { token } = response.data;
      setCookie(undefined, "eltonfintech.token", token, {
        maxAge: 60 * 60 * 24 * 1,
        path: "/",
      });
      api.defaults.headers["Authorization"] = `Bearer ${token}`;
      await reloadUserData();

      router.push("/dashboard");
    } catch {
      alert("Erro ao realizar login");
      setUser(null);
    }
  }

  async function logout(): Promise<void> {
    destroyCookie(null, "eltonfintech.token", { path: "/" });
    destroyCookie(null, "eltonfintech.token", { path: "/dashboard" });
    setUser(null);
    api.defaults.headers["Authorization"] = ``;
    router.push("/login");
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        signIn,
        loading,
        logout,
        user,
        reloadUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
