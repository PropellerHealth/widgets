import React from "react";
import moment from "moment";
import { translate } from "react-i18next";

import Page from "./Page";
import Header from "./Header";
import PatientInfo from "./PatientInfo";
import PatientStatus from "./PatientStatus";
import MedicationUsage from "./MedicationUsage";

import { sortDates } from "../../utilities";

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

const frozenCopy = (dst, src, ...rest) =>
  Object.freeze(Object.assign(dst, Object.freeze(src), ...rest));

class PatientSummary extends React.Component {

  updateLocale = function updateLocale(locale) {
    this.props.i18n.changeLanguage(locale);
  };

  constructor(props) {
    super(props);
    const { locale, i18n } = props;
    if (locale && locale !== i18n.language) {
      this.updateLocale(locale);
    }
  }

  componentWillReceiveProps({ locale }) {
    if (locale && locale !== this.props.locale) {
      this.updateLocale(locale);
    }
  }

  render() {
    const {
      range,
      patient,
      medications,
      days,
      adherence = [],
      controlStatus,
      transitionAlerts,
      alerts,
      trends
    } = this.props;

    const _controller = adherence
      .map(d => frozenCopy({}, d, { date: new Date(d.date) }))
      .sort(sortDates)
      .reduce((arr, d) => arr.concat(incrementToDays(d, 7)), []);

    const rescueNights = days.filter(d => d.rescue.nightEvents > 0).length;

    // console.log("_controller", _controller);
    // console.log(days);
    // console.log(medications);

    return (
      <Page first>
        <Header timeFrame={range} disease={patient.disease} />
        <PatientInfo
          patient={patient}
          medications={medications}
        />
        <PatientStatus
          medications={medications}
          controlStatus={controlStatus}
          rescueNights={rescueNights}
          trends={trends}
        />
        <MedicationUsage
          range={range}
          days={days}
          medications={medications}
          controller={_controller}
          alerts={alerts}
          transitionAlerts={transitionAlerts}
        />
      </Page>
    );
  }

}

export default translate("patient-report")(PatientSummary);
