import {
  createContext,
  useContext,
  createSignal,
  JSX,
  createEffect,
} from "solid-js";
import type { LoginResponse } from "../api/auth";

interface AuthContextType {
  user: () => LoginResponse | null;
  isAuthenticated: () => boolean;
  login: (userData: LoginResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>();

export const AuthProvider = (props: { children: JSX.Element }) => {
  const [user, setUser] = createSignal<LoginResponse | null>(null);

  createEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user data:", e);
        logout();
      }
    }
  });

  const login = (userData: LoginResponse) => {
    localStorage.setItem("token", userData.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const isAuthenticated = () => user() !== null;

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
