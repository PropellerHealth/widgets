import React, { Component } from "react";
import Loading from "../../components/Loading";
import PatientSummary from "./PatientSummary";
import moment from "moment";
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

const incrementToDays = (toCopy, days) => {
  const ary = new Array(days);
  for (let i = 0; i < days; i++) {
    ary[i] = Object.assign({}, toCopy, {
      date: moment(toCopy.date)
        .add(i, "days")
        .toDate()
    });
  }
  return ary;
};

class PatientReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patient             : props.patient,
      dailySummary        : props.dailySummary,
      controllerAdherence : props.controllerAdherence,
      locale              : props.locale,
      alerts              : props.alerts,
      quiz                : props.quiz
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

    // do all of our heavy data munging here and just feed the result downstream
    const { controlStatus = [], days = [], trends = {} } = dailySummary;

    const rescueNights = days.filter(d => d.rescue.nightEvents > 0).length;
    const rescueMeds   = medications.filter(m => "rescue" === m.medication.type);
    const sortedDays   = days.sort(sortDates);
    const range        = [
      sortedDays[0],
      sortedDays[sortedDays.length - 1]
    ].map(m => new Date(m.date));

    // moment diff is not inclusive of the range, so add 1
    const period = moment(range[1]).diff(moment(range[0]), "days") + 1;

    const oldestLastSync = medications
      .map(med => med.sensors.map(s => s.lastSyncDate))
      .reduce((ary, times) => ary.concat(times))
      .sort(sortDates)[0];

    const adherence  = controllerAdherence.sort(sortDates);

    const controllerMeds = medications
      .filter(m => "controller" === m.medication.type)
      .map(med => {
        med.adherenceByWeek = adherence
          .map(week => ({
            date   : new Date(week.date),
            values : week.medications.find(m => med.medicationId === m.mid)
          }))
          .reduce((arr, d) => arr.concat(incrementToDays(d, 7)), []);

        med.adherenceByDay = sortedDays.map(day => ({
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
        lastSync={oldestLastSync}
        medications={{ rescue: rescueMeds, controller: controllerMeds }}
        days={sortedDays}
        controlStatus={controlStatus}
        alerts={alerts}
        trends={trends}
        quiz={quiz}
        locale={locale}
        period={period}
        rescueNights={rescueNights}
      />
    );
  }
}

export default PatientReport;
