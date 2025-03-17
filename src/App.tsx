import { useState } from "react";
import "./App.css";
import sessions from "./data/sessions.json";
import upcomingSessions from "./data/upcoming.json";

function App() {
  const Session = ({
    title,
    date,
    description,
  }: {
    title: string;
    date: string;
    description: string;
  }) => {
    return (
      <div className="session-item">
        <p className="session-title">{title}</p>
        <p className="session-date">{date}</p>
        <div className="session-hr"></div>
        <p className="session-description">{description}</p>
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
        <div className="navigation">
          <a href="#">session recaps</a>
        </div>
      </header>
      <div className="sections">
        <section className="session-highlights">
          <h2>Session Highlights</h2>
          <div className="sessions-container">
            {sessions.slice(0, 3).map((session) => (
              <Session key={session.title} {...session} />
            ))}
            <button>search all</button>
          </div>
        </section>
        <section style={{ display: "flex", alignItems: "center" }}>
          &#9888; Coming soon &#9888;
        </section>
        <section>
          <h2>Upcoming Sessions</h2>
          <div className="upcoming-container">
            {upcomingSessions.map((session) => (
              <UpcomingSession {...session} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default App;
