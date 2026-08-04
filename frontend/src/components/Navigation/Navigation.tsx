import { Link, useNavigate } from "react-router-dom"
import SmallSparkle from "@/assets/svgs/small-sparkle.svg?react"
import styles from "./Navigation.module.css"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"

export default function Navigation () {
  const navigate = useNavigate()
  const { isAuthenticated, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const redirectToLogin = () => {
    navigate("/login")
  }

  return (
    <header>
      <Link className={styles.title} to={"/"}>
        <SmallSparkle className={styles.small_sparkle}/>
        <h1>Quest<span>Base</span></h1>
      </Link>
      {/* Desktop Links */}
      <div className={styles.navigation}>
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        <Link to="#project">Project</Link>
        <Link to="#features">Features</Link>
        <Link to="/#contact">Contact</Link>
        <Link to="#support">Support</Link>
      </div>
      <div className={styles.navigation}>
        {isAuthenticated 
          ? <button 
              className={styles.logout_button} 
              onClick={() => logout(redirectToLogin)}
            >
              Logout
            </button>
          : <Link to="/login">Login</Link>
        }
      </div>
      {/* Hamburger */}
      <button
        className={`${styles.hamburger} ${menuOpen ? styles.open : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      {/* Mobile Menu */}
      <div
        className={`${styles.mobileMenu} ${
          menuOpen ? styles.open : ""
        }`}
      >
        <Link to="/">Home</Link>
        {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
        <Link to="#project">Project</Link>
        <Link to="#features">Features</Link>
        <Link to="#support">Support</Link>
        {isAuthenticated 
          ? <button 
              className={styles.logout_button} 
              onClick={() => logout(redirectToLogin)}
            >
              Logout
            </button>
          : <Link to="/login">Login</Link>
        }
      </div>
    </header>
  )
}