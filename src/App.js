import React from "react";
import { Switch, Route } from "react-router-dom";
import { timeFormatLocale } from "d3-time-format";
import AsthmaConditions from "./embeds/AsthmaConditions/index";
import FindMyDoctor from "./embeds/FindMyDoctor/FindMyDoctor";
import PatientReport from "./embeds/PatientReport";
import ResmedDashboard from "./embeds/ResmedDashboard";
import d3Locales from "./d3Locales";

import moment from "moment";
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

  constructor(props) {
    super(props);
    if (props.locale) {
      // this is ugly, but otherwise we're using defaults,
      // which for moment is the last locale loaded
      // consider restructuring how we init the I18nextProvider, wrapping it
      // to see if we can handle it inside there, leveraging the initial language
      moment.locale(props.locale);
      timeFormatLocale(d3Locales[props.locale] || d3Locales["en-US"]);
    } else {
      moment.locale("en-US");
      timeFormatLocale(d3Locales["en-US"]);
    }
  }

  render() {
    const { props } = this;

    return (
      <Switch>
        <Route
          path="/asthma-conditions"
          render={() =>  <AsthmaConditions {...props}/> }
        />
        <Route
          path="/find-my-doctor"
          render={() =>  <FindMyDoctor {...props}/> }
        />
        <Route
          exact
          path="/patient-summary"
          render={routeProps => <PatientReport {...routeProps} {...props} /> }
        />
        <Route
          path="/patient-summary/:reportId"
          render={routeProps => <PatientReport {...routeProps} {...props} /> }
        />
        <Route path="/resmed-demo" render={() => <ResmedDashboard {...props} />} />
        <Route render={() => <div>No match</div>} />

      </Switch>
    );
  }
}

export default App;
