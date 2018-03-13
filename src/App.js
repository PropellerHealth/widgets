import React from "react";
import { I18nextProvider } from "react-i18next";
import { Switch, Route } from "react-router-dom";
import AsthmaConditions from "./embeds/AsthmaConditions/index";
import FindMyDoctor from "./embeds/FindMyDoctor/FindMyDoctor";
import PatientReport from "./embeds/PatientReport";

import i18n from "./i18n";

import "./App.css";

class App extends React.Component {

  render() {
    const { props } = this;

    return (
      <I18nextProvider i18n={i18n} initialLanguage={props.locale || "en-US"}>
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
      </I18nextProvider>
    );
  }
}

export default App;
