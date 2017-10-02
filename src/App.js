import React from "react";
import { Switch, Route } from "react-router-dom";
import AsthmaConditions from "./embeds/AsthmaConditions/index";
// import logo from './logo.svg';
import "./App.css";

if (typeof window === "undefined") {
  global.window = {};
}

class App extends React.Component {

  render() {
    const { props } = this;

    return (
      <Switch>
        <Route path="/asthma-conditions" render={() =>  <AsthmaConditions {...props}/> } />
        <Route render={() => <div>No match</div>} />
      </Switch>
    );
  }
}

export default App;
