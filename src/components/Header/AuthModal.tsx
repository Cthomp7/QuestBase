import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import closeIcon from "../../assets/x.svg";
import styles from "./AuthModal.module.css";

interface AuthModalProps {
  show: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  apiBaseUrl: string;
}

const AuthModal: React.FC<AuthModalProps> = ({
  show,
  onClose,
  onLoginSuccess,
  apiBaseUrl,
}) => {
  const { setLoggedIn, setUserName, setPermission } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    code: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [messages, setMessages] = useState({
    loginError: "",
    registerError: "",
    registerSuccess: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessages((m) => ({ ...m, loginError: "" }));
    try {
      const res = await fetch(`${apiBaseUrl}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Invalid credentials");

      setLoggedIn(true);
      setUserName(data.name ?? "");
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("userName", data.name ?? "");
      setPermission(data.permission ?? "");
      localStorage.setItem("permission", data.permission ?? "");
      onLoginSuccess();
      onClose();
    } catch (error) {
      setMessages((m) => ({
        ...m,
        loginError: error instanceof Error ? error.message : String(error),
      }));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const { email, password, confirm } = registerForm;

    if (!email || !password)
      return setMessages((m) => ({
        ...m,
        registerError: "Email and password are required",
      }));
    if (password !== confirm)
      return setMessages((m) => ({
        ...m,
        registerError: "Passwords do not match",
      }));

    try {
      const res = await fetch(`${apiBaseUrl}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, code: registerForm.code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Registration failed");

      // Registration successful, now log in automatically
      try {
        const loginRes = await fetch(`${apiBaseUrl}/api/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok)
          throw new Error(
            loginData?.message ?? "Login after registration failed"
          );

        setLoggedIn(true);
        setUserName(loginData.name ?? "");
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("userName", loginData.name ?? "");
        onLoginSuccess();
        onClose();
        setRegisterForm({ code: "", email: "", password: "", confirm: "" });
        setMessages({ registerError: "", registerSuccess: "", loginError: "" });
      } catch (loginError) {
        setMessages((m) => ({
          ...m,
          registerError:
            loginError instanceof Error
              ? loginError.message
              : String(loginError),
        }));
      }
    } catch (error) {
      setMessages((m) => ({
        ...m,
        registerError: error instanceof Error ? error.message : String(error),
      }));
    }
  };

  const handleInputChange = (
    form: "login" | "register",
    field: string,
    value: string
  ) => {
    if (form === "login") {
      setLoginForm((f) => ({ ...f, [field]: value }));
    } else {
      setRegisterForm((f) => ({ ...f, [field]: value }));
    }
  };

  const closeRegister = () => {
    setShowRegister(false);
    setMessages((m) => ({ ...m, registerError: "", registerSuccess: "" }));
  };

  if (!show) return null;

  return (
    <div className={styles["auth-modal-overlay"]}>
      <form
        onSubmit={showRegister ? handleRegister : handleLogin}
        className={styles["auth-modal-form"]}
      >
        <div className={styles["auth-modal-header"]}>
          <h2>{showRegister ? "Register Account" : "Sign In"}</h2>
          <button type="button" onClick={onClose}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>

        {showRegister ? (
          <>
            <input
              type="code"
              placeholder="Registration Code"
              value={registerForm.code}
              onChange={(e) =>
                handleInputChange("register", "code", e.target.value)
              }
              autoFocus
              autoComplete="off"
            />
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) =>
                handleInputChange("register", "email", e.target.value)
              }
              autoComplete="username"
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) =>
                handleInputChange("register", "password", e.target.value)
              }
              autoComplete="new-password"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={registerForm.confirm}
              onChange={(e) =>
                handleInputChange("register", "confirm", e.target.value)
              }
              autoComplete="new-password"
            />
            {messages.registerError && (
              <div className={styles["auth-error"]}>
                {messages.registerError}
              </div>
            )}
            <div className={styles["auth-actions"]}>
              <button type="submit">Register</button>
              <button type="button" onClick={closeRegister}>
                Back to Sign In
              </button>
            </div>
          </>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={loginForm.email}
              onChange={(e) =>
                handleInputChange("login", "email", e.target.value)
              }
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              value={loginForm.password}
              onChange={(e) =>
                handleInputChange("login", "password", e.target.value)
              }
            />
            {messages.loginError && (
              <div className={styles["auth-error"]}>{messages.loginError}</div>
            )}
            <div className={styles["auth-actions"]}>
              <button type="submit">Sign In</button>
              <button type="button" onClick={() => setShowRegister(true)}>
                Register
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default AuthModal;
