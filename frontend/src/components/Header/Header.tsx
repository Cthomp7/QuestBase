import { Link } from "react-router-dom";
import icon from "./../../assets/favicon-32x32.png";
import styles from "./Header.module.css";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const { isAuthenticated } = useAuth();

  return (
    <header>
      <Link className={styles.title} to={"/"}>
        <img src={icon} alt="icon" className={styles.icon} />
        <h1>QuestBase</h1>
      </Link>
      <div className={styles.navigation}>
        {isAuthenticated 
          ? <>
            <Link to="/">Base</Link>
            <Link to="/codex">Codex</Link>
            <Link to="/npcs">NPCs</Link>
            </>
          : <Link to="/">Dashboard</Link>
        }
      </div>
      <div className={styles.navigation}>
        {isAuthenticated 
          ? <Link to="/login">Login</Link>
          : <>
            {/* <Link to="/profile">Profile</Link> // TODO: add /profile page + change to a profile picture */}
            <Link to="">Logout</Link> {/* // TODO configure & eventually move to /profile page */}
            </>
        }
      </div>
    </header>
  );
};

export default Header;
