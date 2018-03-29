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

import "./index.css";

class PatientReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient              : props.patient,
      dailySummary         : props.dailySummary,
      controllerAdherence  : props.controllerAdherence,
      locale               : props.locale,
      alerts               : props.alerts,
      quiz                 : props.quiz
    };
    this.loadData = this.loadData.bind(this);
  }

  loadData() {
    const { API_HOST = "http://localhost:8081", match, location } = this.props;
    const { reportId } = match.params;
    const { accessToken, host = API_HOST } = objectFromQueryString(
      location.search
    );

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
      medications = [],
      dailySummary = {},
      controllerAdherence = [],
      alerts,
      locale,
      quiz
    } = this.state;

    if (!patient) return <Loading />;

    const { controlStatus = [], days = [], trends = {} } = dailySummary;

    const sortedDays = days.sort(sortDates);
    const adherence  = controllerAdherence.sort(sortDates);
    const range      = [sortedDays[0], sortedDays[sortedDays.length - 1]]
      .map(m => new Date(m.date));

    const rescueMeds = medications.filter(m => "rescue" === m.medication.type);

    const controllerMeds = medications
      .filter(m => "controller" === m.medication.type)
      .map(med => {
        med.adherence = sortedDays.map(day => ({
          date   : new Date(day.date),
          values : day.controller.meds.find(m => m.mid === med.medicationId)
        }));
        return med;
      });

    // console.log(controllerMeds);
    // console.log("sortedDaus", sortedDays);
    // console.log(range);
    // console.log(adherence);

    return (
      <PatientSummary
        range={range}
        patient={patient}
        medications={{ rescue: rescueMeds, controller: controllerMeds }}
        days={sortedDays}
        adherence={adherence}
        controlStatus={controlStatus}
        alerts={alerts}
        trends={trends}
        quiz={quiz}
        locale={locale}
      />
    );
  }
}

export default PatientReport;
