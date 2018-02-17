import React from "react";
import { HashRouter as Router } from "react-router-dom";
import Navigation from "./Navigation";

function App() {
  return (
    <Router>
      <div>
        <Navigation />Hello World
      </div>
    </Router>
  );
}

export default App;
