import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";

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
  const { setLoggedIn, setUserName } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
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
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Registration failed");

      setMessages({
        registerSuccess: "Registration successful! You can now sign in.",
        registerError: "",
        loginError: "",
      });
      setRegisterForm({ email: "", password: "", confirm: "" });
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
    <div className="auth-modal-overlay">
      <form
        onSubmit={showRegister ? handleRegister : handleLogin}
        className="auth-modal-form"
      >
        <h2>{showRegister ? "Register" : "Sign In"}</h2>

        {showRegister ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={registerForm.email}
              onChange={(e) =>
                handleInputChange("register", "email", e.target.value)
              }
              autoFocus
            />
            <input
              type="password"
              placeholder="Password"
              value={registerForm.password}
              onChange={(e) =>
                handleInputChange("register", "password", e.target.value)
              }
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={registerForm.confirm}
              onChange={(e) =>
                handleInputChange("register", "confirm", e.target.value)
              }
            />
            {messages.registerError && (
              <div className="auth-error">{messages.registerError}</div>
            )}
            {messages.registerSuccess && (
              <div className="auth-success">{messages.registerSuccess}</div>
            )}
            <div className="auth-actions">
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
              <div className="auth-error">{messages.loginError}</div>
            )}
            <div className="auth-actions">
              <button type="submit">Sign In</button>
              <button type="button" onClick={onClose}>
                Cancel
              </button>
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
