import React, { Component } from "react";
import Loading from "../../components/Loading";
import PatientSummary from "./PatientSummary";
import "moment";
import "moment/locale/ca.js";
import "moment/locale/de.js";
import "moment/locale/en-ca.js";
import "moment/locale/en-gb.js";
import "moment/locale/en-ie.js";
import "moment/locale/es.js";
import "moment/locale/es-us.js";
import "moment/locale/fr.js";
import "moment/locale/fr-ca.js";
import "moment/locale/it.js";
import "moment/locale/nl.js";

import {
  checkResponse,
  extractJSON,
  objectFromQueryString,
  sortDates
} from "../../utilities";

class PatientReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient              : props.patient,
      transitionAlertDates : props.transitionAlertDates,
      dailySummary         : props.dailySummary,
      controllerAdherence  : props.controllerAdherence,
      locale               : props.locale
    };
    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    const { API_HOST = "http://localhost:8081", match, location } = this.props;
    const { reportId } = match.params;
    const { accessToken, host = API_HOST } = objectFromQueryString(location.search);

    const url = `${host}/api/reports/${reportId}/data?accessToken=${accessToken}`;

    window
      .fetch(url, { headers: { "x-ph-api-version": "3.33.0" } })
      .then(checkResponse)
      .then(extractJSON)
      .then(data => this.setState({ ...data }))
      .catch(console.error);
  }

  componentDidMount() {
    if (!this.state.patient) {
      this.loadData();
    }
  }

  render() {
    const {
      patient,
      transitionAlertDates,
      dailySummary = {},
      controllerAdherence = [],
      locale
    } = this.state;

    if (!patient) return <Loading />;

    const { controlStatus = [], rescueUsage = [] } = dailySummary;

    const rescue     = rescueUsage.sort(sortDates);
    const controller = controllerAdherence.sort(sortDates);
    const range      = [rescue[0], rescue[rescue.length - 1]]
      .sort(sortDates)
      .map(m => m.date);

    return (
      <PatientSummary
        range={range}
        patient={patient}
        rescue={rescue}
        controller={controller}
        controlStatus={controlStatus}
        transitionAlerts={transitionAlertDates}
        locale={locale}
      />
    );
  }
}

export default PatientReport;
