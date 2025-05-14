import { useEffect, useState } from "react";
import styles from "./page.module.css";
import sessions from "../../data/sessions.json";
import upcomingSessions from "../../data/upcoming.json";
import closeIcon from "../../assets/x.svg";
import { Link } from "react-router-dom";
import bookOpen from "../../assets/book-marked.svg";
import bookUser from "../../assets/book-user.svg";
import stretchHorizontal from "../../assets/stretch-horizontal.svg";
import map from "../../assets/map.svg";
import userIcon from "@/assets/user-icon.jpg";
import { useAuth } from "@/context/AuthContext";
import Dropdown from "@/components/Dropdown";

interface SessionHighlight {
  title: string;
  date: string;
  description: string;
  recap: string;
}

function Home() {
  const { loggedIn, userName, permission } = useAuth();
  const [popup, setPopup] = useState<SessionHighlight | null>(null);
  const [showMore, setShowMore] = useState<boolean>(false);
  const [view, setView] = useState("admin");
  const dropdownOptions = [
    { label: "Admin View", value: "admin" },
    { label: "Player View", value: "player" },
  ];

  // Filter upcoming sessions to only show future dates
  const filteredUpcomingSessions = upcomingSessions.filter((session) => {
    // Parse date string like "Thursday, October 24th 2024"
    const dateParts = session.date.split(", ")[1].split(" "); // ["October", "24th", "2024"]
    const month = dateParts[0];
    const day = parseInt(dateParts[1].replace(/(?:st|nd|rd|th)/, ""));
    const year = parseInt(dateParts[2]);

    const sessionDate = new Date(year, new Date(month + " 1").getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
    return sessionDate >= today;
  });

  const Session = (props: SessionHighlight) => {
    const { title, date, description } = props;
    return (
      <button className={styles.session_item} onClick={() => setPopup(props)}>
        <p className={styles.session_title}>{title}</p>
        <p className={styles.session_date}>{date}</p>
        <div className={styles.session_hr}></div>
        <p className={styles.session_description}>{description}</p>
      </button>
    );
  };

  const SessionPopup = (props: SessionHighlight) => {
    const { title, date, recap } = props;
    return (
      <div className={styles.session_popup_item}>
        <div className={styles.popup_header}>
          <div>
            <p className={styles.session_title}>{title}</p>
            <p className={styles.session_date}>{date}</p>
          </div>
          <button className={styles.popup_close} onClick={() => setPopup(null)}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div className={styles.session_hr}></div>
        <p className={styles.session_popup_description}>{recap}</p>
      </div>
    );
  };

  const UpcomingSession = ({ date, time }: { date: string; time: string }) => {
    return (
      <div className={styles.upcoming_item}>
        <p className={styles.upcoming_date}>{date}</p>
        <p className={styles.upcoming_time}>{time}</p>
      </div>
    );
  };

  return (
    <div>
      {loggedIn && userName && (
        <div className={styles.home_header}>
          <div className={styles.home_header_greeting}>
            <img src={userIcon} alt="user icon" />
            <h1>Welcome back, {userName}!</h1>
          </div>
          {permission === "admin" && (
            <Dropdown
              options={dropdownOptions}
              value={view}
              onChange={setView}
            />
          )}
        </div>
      )}
      <div className={styles.sections}>
        <section
          className={`${styles.session_highlights} ${
            showMore ? styles.expanded : ""
          }`}
        >
          <h2>Session Highlights</h2>
          <div className={styles.sessions_container}>
            {sessions.slice(0, showMore ? undefined : 3).map((session) => (
              <Session key={session.title} {...session} />
            ))}
          </div>
          <button
            className={styles.show_more_button}
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "show less" : "show more"}
          </button>
        </section>
        <section className={styles.resources_container}>
          <Link to="/codex" className={styles.resource}>
            <div className={styles.resource_title}>
              <p>Codex</p>
              <img src={bookOpen} alt="book icon" />
            </div>
            <div className={styles.resource_info}>
              <p>
                Lore regarding our campaign that includes Setting, Races,
                Technology, History, and more!
              </p>
            </div>
          </Link>
          <Link to="/npcs" className={styles.resource}>
            <div className={styles.resource_title}>
              <p>NPCs</p>
              <img src={bookUser} alt="book icon" />
            </div>
            <div className={styles.resource_info}>
              <p>Characters either mentioned or met along the way.</p>
            </div>
          </Link>
          <Link to="/" className={styles.resource}>
            <div className={styles.resource_title}>
              <p>Inventory</p>
              <img src={stretchHorizontal} alt="book icon" />
            </div>
            <div className={styles.resource_info}>
              <p>Coming Soon!</p>
            </div>
          </Link>
          <Link to="/" className={styles.resource}>
            <div className={styles.resource_title}>
              <p>Map</p>
              <img src={map} alt="book icon" />
            </div>
            <div className={styles.resource_info}>
              <p>Coming Soon!</p>
            </div>
          </Link>
        </section>
        <section>
          <h2>Upcoming Sessions</h2>
          <div className={styles.upcoming_container}>
            {filteredUpcomingSessions.map((session) => (
              <UpcomingSession key={session.date} {...session} />
            ))}
          </div>
        </section>
        {popup && <SessionPopup {...popup} />}
      </div>
    </div>
  );
}

export default Home;
