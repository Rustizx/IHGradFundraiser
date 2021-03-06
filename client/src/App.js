import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

import HomePage from "./pages/HomePage";
import FinalizePage from "./pages/FinalizePage";
import AmountsScreen from "./pages/obs/AmountsScreen";


const App = () => {

  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route path="/finalize/:token" component={FinalizePage} />
        <Route path="/facebook" render={() => (window.location = "https://www.facebook.com/ihgrad")} />
        <Route path="/obs/amount" component={AmountsScreen} />
      </Switch>
    </Router>
  );
};

export default App;