import React from "react";
import { Switch, Route } from "react-router-dom";
import AsthmaConditions from "./embeds/AsthmaConditions/index";
import FindMyDoctor from "./embeds/FindMyDoctor/FindMyDoctor";
import PatientReport from "./embeds/PatientReport";

// import logo from './logo.svg';

if (typeof window === "undefined") {
  global.window = {};
}

class App extends React.Component {

  render() {
    const { props } = this;

    return (
      <Switch>
        <Route path="/asthma-conditions" render={() =>  <AsthmaConditions {...props}/> } />
        <Route path="/find-my-doctor" render={() =>  <FindMyDoctor {...props}/> } />
        <Route path="/patient-report" render={() => <PatientReport {...props} /> } />
        <Route render={() => <div>No match</div>} />
      </Switch>
      );
    }
  }

  export default App;