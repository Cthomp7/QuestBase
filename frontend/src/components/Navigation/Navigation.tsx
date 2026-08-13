import { Link, useNavigate } from "react-router-dom"
import { HashLink } from "react-router-hash-link";
import SmallSparkle from "@/assets/svgs/small-sparkle.svg?react"
import styles from "./Navigation.module.css"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import ProfilePicture from "@/assets/imgs/profiles/default.png"
import MenuDropdown from "../MenuDropdown/MenuDropdown";

export default function Navigation () {
  const navigate = useNavigate()
  const { isAuthenticated, logout, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)
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
        <HashLink smooth to="/#project">Project</HashLink>
        <HashLink smooth to="/#features">Features</HashLink>
        <HashLink smooth to="/#contact">Contact</HashLink>
        {/* <HashLink smooth to="/#support">Support</HashLink> */}
      </div>
      <div className={styles.navigation}>
        {isAuthenticated 
          ? <>
              <div className={styles.profile_picture_wrapper}>
                <img 
                  src={ProfilePicture} 
                  alt="default profile picture"
                  className={styles.profile_picture} 
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  style={{ transform: "translateY(-5px) translateX(4px)" }}
                />
              </div>
              <MenuDropdown
                open={accountMenuOpen}
                textAlign="left"
                style={{ right: "10px"}}
                children={
                  <>
                    <div className={styles.account_info}>
                      <img 
                        src={ProfilePicture} 
                        alt="default profile picture"
                        className={styles.profile_picture} 
                        onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                      />
                      <div>
                        <p className={styles.user_display_name}>{user?.displayName}</p>
                        <p className={styles.user_email}>{user?.email}</p>
                      </div>
                    </div>
                    <hr />
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/campaigns">Campaigns</Link>
                    <Link to="/settings">Settings</Link>
                    <hr />
                    <Link onClick={() => logout(redirectToLogin)} to="#">Logout</Link>
                  </>
                }
              ></MenuDropdown>
            </>
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
      <MenuDropdown
        open={menuOpen}
        style={{ top: 0, marginTop: 0, paddingTop: "50px" }}
        mobile={true}
        textAlign="right"
        children={
          <>
            <Link to="/">Home</Link>
            {isAuthenticated && <Link to="/dashboard">Dashboard</Link>}
            <Link to="#project">Project</Link>
            <HashLink smooth to="/#contact">Contact</HashLink>
            {/* <Link to="#support">Support</Link> */}
            {isAuthenticated 
              ? <button 
                  className={styles.logout_button} 
                  onClick={() => logout(redirectToLogin)}
                >
                  Logout
                </button>
              : <Link to="/login">Login</Link>
            }
          </>
        }
      >
      </MenuDropdown>
    </header>
  )
}