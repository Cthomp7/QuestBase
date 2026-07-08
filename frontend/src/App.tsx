import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/page";
import Codex from "./pages/codex/page";
import "./App.css";
import Header from "./components/Header/Header";
import NPCs from "./pages/npcs/page";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Campaigns from "./pages/campaigns/Campaigns";
// import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      {<Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />}/>
        <Route path="/codex" element={<Codex />} />
        <Route path="/codex/*" element={<Codex />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/npcs/" element={<NPCs />} />
        <Route path="/npcs/*" element={<NPCs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
