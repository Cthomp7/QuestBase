import { Link, useNavigate } from "react-router-dom"
import SmallSparkle from "@/assets/svgs/small-sparkle.svg?react"
import styles from "./Header.module.css"
import { useAuth } from "@/context/AuthContext"

const Header = () => {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()

  const redirectToLogin = () => {
    navigate("/login")
  }

  return (
    <header>
      <Link className={styles.title} to={"/"}>
        <SmallSparkle className={styles.small_sparkle}/>
        <h1>Quest<span>Base</span></h1>
      </Link>
      <div className={styles.navigation}>
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        <Link to="#project">Project</Link>
        <Link to="#features">Features</Link>
        <Link to="#support">Support</Link>
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
