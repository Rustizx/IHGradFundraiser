import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Navbar, Container } from "react-bootstrap";

import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import HomePage from "./pages/HomePage";
import FinalizePage from "./pages/FinalizePage";

function App() {
  return (
    <Router>
      <Container>
        <Navbar className="nav justify-content-center" fixed="top" fluid="true" style={{height: "80px"}}>
            <h1 className="nav-title">IHHS Graduation</h1>
        </Navbar>
      </Container>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/finalize/:token" component={FinalizePage} />
        <Route path="/facebook" render={() => (window.location = "https://www.facebook.com/ihgrad")} />
      </Switch>
    </Router>
  );
};

export default App;