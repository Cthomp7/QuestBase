import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AuthContextType {
  loggedIn: boolean;
  userName: string;
  setLoggedIn: (value: boolean) => void;
  setUserName: (name: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("loggedIn") === "true"
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || ""
  );

  useEffect(() => {
    const syncLogin = () => {
      setLoggedIn(localStorage.getItem("loggedIn") === "true");
      setUserName(localStorage.getItem("userName") || "");
    };
    window.addEventListener("storage", syncLogin);
    return () => window.removeEventListener("storage", syncLogin);
  }, []);

  const logout = () => {
    setLoggedIn(false);
    setUserName("");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider
      value={{ loggedIn, userName, setLoggedIn, setUserName, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
