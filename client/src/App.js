import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Navbar from "react-bootstrap/Navbar"

import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from "./pages/HomePage";

function App() {
  return (
    <Router>
      <Navbar className="nav justify-content-center" fixed="top" fluid="true">
          <h1 className="nav-title">IHHS Graduation</h1>
      </Navbar>
      <Switch>
        <Route exact path="/" component={HomePage}/>
      </Switch>
    </Router>
  );
};

export default App;