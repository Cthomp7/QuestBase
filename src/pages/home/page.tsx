import { useState } from "react";
import styles from "./page.module.css";
import sessions from "../../data/sessions.json";
import upcomingSessions from "../../data/upcoming.json";
import closeIcon from "../../assets/x.svg";
import { Link } from "react-router-dom";

interface SessionHighlight {
  title: string;
  date: string;
  description: string;
  recap: string;
}

function Home() {
  const [popup, setPopup] = useState<SessionHighlight | null>(null);
  const [showMore, setShowMore] = useState<boolean>(false);

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
      <section style={{ display: "flex", alignItems: "center" }}>
        <Link to="/codex">Go to Codex</Link>
      </section>
      <section>
        <h2>Upcoming Sessions</h2>
        <div className={styles.upcoming_container}>
          {upcomingSessions.map((session) => (
            <UpcomingSession {...session} />
          ))}
        </div>
      </section>
      {popup && <SessionPopup {...popup} />}
    </div>
  );
}

export default Home;
