import { useState } from "react";
import "./App.css";
import sessions from "./data/sessions.json";
import upcomingSessions from "./data/upcoming.json";
import closeIcon from "./assets/x.svg";

interface SessionHighlight {
  title: string;
  date: string;
  description: string;
  recap: string;
}

function App() {
  const [popup, setPopup] = useState<SessionHighlight | null>(null);
  const [showMore, setShowMore] = useState<boolean>(false);

  const Session = (props: SessionHighlight) => {
    const { title, date, description } = props;
    return (
      <button className="session-item" onClick={() => setPopup(props)}>
        <p className="session-title">{title}</p>
        <p className="session-date">{date}</p>
        <div className="session-hr"></div>
        <p className="session-description">{description}</p>
      </button>
    );
  };

  const SessionPopup = (props: SessionHighlight) => {
    const { title, date, recap } = props;
    return (
      <div className="session-popup-item">
        <div className="popup-header">
          <div>
            <p className="session-title">{title}</p>
            <p className="session-date">{date}</p>
          </div>
          <button className="popup-close" onClick={() => setPopup(null)}>
            <img src={closeIcon} alt="close" />
          </button>
        </div>
        <div className="session-hr"></div>
        <p className="session-popup-description">{recap}</p>
      </div>
    );
  };

  const UpcomingSession = ({ date, time }: { date: string; time: string }) => {
    return (
      <div className="upcoming-item">
        <p className="upcoming-date">{date}</p>
        <p className="upcoming-time">{time}</p>
      </div>
    );
  };

  return (
    <>
      <header>
        <h1>:{")"} Codexia</h1>
        <div className="navigation">{/* <a href="#">session recaps</a> */}</div>
      </header>
      <div className="sections">
        <section className={`session-highlights ${showMore ? "expanded" : ""}`}>
          <h2>Session Highlights</h2>
          <div className="sessions-container">
            {sessions.slice(0, showMore ? undefined : 3).map((session) => (
              <Session key={session.title} {...session} />
            ))}
          </div>
          <button
            className="show-more-button"
            onClick={() => setShowMore(!showMore)}
          >
            {showMore ? "show less" : "show more"}
          </button>
        </section>
        <section style={{ display: "flex", alignItems: "center" }}>
          {/* &#9888; Coming soon &#9888; */}
        </section>
        <section>
          <h2>Upcoming Sessions</h2>
          <div className="upcoming-container">
            {upcomingSessions.map((session) => (
              <UpcomingSession {...session} />
            ))}
          </div>
        </section>
        {popup && <SessionPopup {...popup} />}
      </div>
    </>
  );
}

export default App;
