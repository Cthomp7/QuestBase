import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/page";
import Codex from "./pages/codex/page";
import "./App.css";
// import About from "./pages/About";
// import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <>
      <header>
        <h1>:{")"} Codexia</h1>
        <div className="navigation">{/* <a href="#">session recaps</a> */}</div>
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/codex" element={<Codex />} />
          <Route path="/codex/*" element={<Codex />} />
          {/* <Route path="/about" element={<About />} /> */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Router>
    </>
  );
};

export default App;
