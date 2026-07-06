import { Link, useNavigate } from "react-router-dom"
import icon from "./../../assets/favicon-32x32.png"
import styles from "./Header.module.css"
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react";

const Header = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const redirectToLogin = () => {
    navigate("/login")
  }

  return (
    <header>
      <Link className={styles.title} to={"/"}>
        <img src={icon} alt="icon" className={styles.icon} />
        <h1>QuestBase</h1>
      </Link>
      <div className={styles.navigation}>
        {isAuthenticated && <Link to="/">Dashboard</Link>}
      </div>
      <div className={styles.navigation}>
        {isAuthenticated 
          ? <>
            {/* <Link to="/profile">Profile</Link> // TODO: add /profile page + change to a profile picture */}
            <button className={styles.logout_button} onClick={() => logout(redirectToLogin)}>Logout</button> {/* // TODO configure & eventually move to /profile page */}
            </>
          : <Link to="/login">Login</Link>
        }
      </div>
    </header>
  );
};

export default Header;
