import { useState } from "react";
import { Link } from "react-router-dom";
import icon from "./../../assets/favicon-32x32.png";
import styles from "./Header.module.css";
import AuthModal from "./AuthModal";
import { useAuth } from "@/context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Header = () => {
  const { logout } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(() => {
    return localStorage.getItem("loggedIn") === "true";
  });

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    localStorage.removeItem("loggedIn");
  };

  return (
    <header>
      <Link className={styles.title} to={"/"}>
        <img src={icon} alt="icon" className={styles.icon} />
        <h1>QuestBase</h1>
      </Link>
      <div className={styles.navigation}>
        <Link to="/">Base</Link>
        <Link to="/codex">Codex</Link>
        <Link to="/npcs">NPCs</Link>
        <p>|</p>
        <button
          className={styles.signInButton}
          onClick={() => {
            if (loggedIn) {
              handleLogout();
            } else {
              setShowLogin(true);
            }
          }}
        >
          {loggedIn ? "Sign out" : "Sign In"}
        </button>
      </div>
      {showLogin && !loggedIn && (
        <AuthModal
          show={showLogin}
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setLoggedIn(true);
            localStorage.setItem("loggedIn", "true");
          }}
          apiBaseUrl={API_BASE_URL}
        />
      )}
    </header>
  );
};

export default Header;
