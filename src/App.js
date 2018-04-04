import React from "react";
import { Switch, Route } from "react-router-dom";
import AsthmaConditions from "./embeds/AsthmaConditions/index";
import FindMyDoctor from "./embeds/FindMyDoctor/FindMyDoctor";
import PatientReport from "./embeds/PatientReport";

import "moment";
import "moment/locale/ca.js";
import "moment/locale/de.js";
import "moment/locale/en-au.js";
import "moment/locale/en-ca.js";
import "moment/locale/en-gb.js";
import "moment/locale/en-ie.js";
import "moment/locale/es.js";
import "moment/locale/es-us.js";
import "moment/locale/fr.js";
import "moment/locale/fr-ca.js";
import "moment/locale/it.js";
import "moment/locale/ko.js";
import "moment/locale/nl.js";
import "moment/locale/ru.js";

import "./App.css";

class App extends React.Component {

  render() {
    const { props } = this;

    return (
      <Switch>
        <Route path="/asthma-conditions" render={() =>  <AsthmaConditions {...props}/> } />
        <Route path="/find-my-doctor" render={() =>  <FindMyDoctor {...props}/> } />
        <Route
          exact
          path="/patient-summary"
          render={routeProps => <PatientReport {...routeProps} {...props} /> }
        />
        <Route
          path="/patient-summary/:reportId"
          render={routeProps => <PatientReport {...routeProps} {...props} /> }
        />
        <Route render={() => <div>No match</div>} />
      </Switch>
    );
  }
}

export default App;
