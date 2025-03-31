import { Link } from "react-router-dom";
import icon from "./../../assets/favicon-32x32.png";
import styles from "./Header.module.css";

const Header = () => {
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
      </div>
    </header>
  );
};

export default Header;
