import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home/page";
import Codex from "./pages/codex/page";
import "./App.css";
import NPCs from "./pages/npcs/page";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Campaigns from "./pages/campaigns/Campaigns";
import PublicLayout from "./layouts/PublicLayout";
// import NotFound from "./pages/NotFound";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Route>

        <Route>
          <Route path="/campaigns" element={<Campaigns />}/>
          <Route path="/codex/*" element={<Codex />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/npcs/*" element={<NPCs />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
