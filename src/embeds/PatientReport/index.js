import React, { Component } from "react";
import Loading from "../../components/Loading";
import PatientSummary from "./PatientSummary";
import moment from "moment-timezone";

import {
  checkResponse,
  extractJSON,
  objectFromQueryString,
  sortDates
} from "../../utilities";

import "./index.css";

const weekToDaysReducer = timeZone => (arr, d) => arr.concat(incrementToDays(timeZone)(d, 8));

const incrementToDays = timeZone => (toCopy, days) => {
  const ary = new Array(days);
  for (let i = 0; i < days; i++) {
    ary[i] = Object.assign({}, toCopy, {
      date: moment(toCopy.date).tz(timeZone).add(i, "days")
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
      medications         : props.medications || [],
      locale              : props.locale,
      alerts              : props.alerts || {},
      quiz                : props.quiz   || {},
      reportLength        : props.reportLength,
      endDate             : props.endDate
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
      .fetch(url, { headers: { "x-ph-api-version": "3.42.0" } })
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
      quiz,
      reportLength = 30,
      endDate
    } = this.state;

    if (!patient) return <Loading />;

    // do all of our heavy data munging here and just feed the result downstream
    const { controlStatus = [], days : _days = [], trends = {} } = dailySummary;
    const { timeZone } = patient;
    const _endDate     = "undefined" === typeof endDate ? dailySummary.trends.endDate : endDate;
    const reportStart  = moment.utc(_endDate).subtract(reportLength, "days");

    const days = _days.map(d => {
      d.date = moment(d.date).tz(timeZone);
      return d;
    });

    const rescueNights = days.filter(d => d.rescue.nightEvents > 0).length;
    const rescueMeds   = medications.filter(m => "rescue" === m.medication.type);
    const sortedDays   = days.sort(sortDates);
    // console.log("sortedDays", sortedDays);
    const range        = [
      reportStart,
      moment(_endDate).tz(timeZone)
    ];

    const sync = patient.sync;

    const syncTimes = {
      first           : moment(sync.first).tz(timeZone),
      last            : moment(sync.last).tz(timeZone),
      firstController : moment(sync.firstController).tz(timeZone),
      lastController  : moment(sync.lastController).tz(timeZone),
      firstRescue     : moment(sync.firstRescue).tz(timeZone),
      lastRescue      : moment(sync.lastRescue).tz(timeZone),
    };

    const startDate = moment(patient.createdDate).tz(timeZone);

    const oldestLastSync = moment(
      medications
        .map(med => med.sensors.map(s => s.lastSyncDate))
        .reduce((ary, times) => ary.concat(times))
        .sort(sortDates)[0]
    ).tz(timeZone);

    const weeklyAdherence = controllerAdherence.sort(sortDates);

    const controllerMeds = medications
      .filter(m => "controller" === m.medication.type)
      .map(med => {
        med.adherenceByWeek = weeklyAdherence
          .map(week => ({
            date   : moment(week.date).tz(timeZone),
            values : week.medications && week.medications.find(m => med.medicationId === m.mid)
          }))
          .sort(sortDates)
          .reduce(weekToDaysReducer(timeZone), []);

        med.adherenceByDay = sortedDays.map(day => ({
          date   : moment.utc(day.date).tz(timeZone),
          values : day.controller && day.controller.meds.find(m => m.mid === med.medicationId)
        }));
        return med;
      });

    const overallAdherence = weeklyAdherence
      .map(week => ({
        date   : moment(week.date).tz(timeZone),
        values : {
          percent: week.values.adherencePercent
        }
      }))
      .sort(sortDates)
      .reduce(weekToDaysReducer(timeZone), []);

    return (
      <PatientSummary
        range={range}
        patient={patient}
        startDate={startDate}
        sync={syncTimes}
        lastSync={oldestLastSync}
        medications={{ rescue: rescueMeds, controller: controllerMeds }}
        days={sortedDays}
        controlStatus={controlStatus}
        alerts={alerts}
        trends={trends}
        quiz={quiz}
        locale={locale}
        rescueNights={rescueNights}
        adherence={overallAdherence}
      />
    );
  }
}

export default PatientReport;
