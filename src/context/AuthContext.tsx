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
  permission: string;
  setLoggedIn: (value: boolean) => void;
  setUserName: (name: string) => void;
  setPermission: (permission: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loggedIn, setLoggedIn] = useState(
    () => localStorage.getItem("loggedIn") === "true"
  );
  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") ?? ""
  );
  const [permission, setPermission] = useState(
    () => localStorage.getItem("permission") ?? ""
  );

  useEffect(() => {
    const syncLogin = () => {
      setLoggedIn(localStorage.getItem("loggedIn") === "true");
      setUserName(localStorage.getItem("userName") ?? "");
      setPermission(localStorage.getItem("permission") ?? "");
    };
    window.addEventListener("storage", syncLogin);
    return () => window.removeEventListener("storage", syncLogin);
  }, []);

  const logout = () => {
    setLoggedIn(false);
    setUserName("");
    setPermission("");
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("permission");
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn,
        userName,
        permission,
        setLoggedIn,
        setUserName,
        setPermission,
        logout,
      }}
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
