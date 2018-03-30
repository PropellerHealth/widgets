import React from "react";
import { translate } from "react-i18next";

import Page from "../../components/Page";
import Header from "./Header";
import PatientInfo from "./PatientInfo";
import PatientStatus from "./PatientStatus";
import MedicationUsage from "./MedicationUsage";

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
      controlStatus,
      alerts,
      trends,
      quiz,
      lastSync,
      period,
      rescueNights
    } = this.props;

    return (
      <Page first>
        <Header range={range} disease={patient.disease} />
        <PatientInfo
          patient={patient}
          medications={medications}
        />
        <PatientStatus
          period={period}
          days={days}
          disease={patient.disease}
          medications={medications}
          controlStatus={controlStatus}
          rescueNights={rescueNights}
          trends={trends}
          quiz={quiz}
          lastSync={lastSync}
        />
        <MedicationUsage
          disease={patient.disease}
          range={range}
          days={days}
          medications={medications}
          alerts={alerts}
          lastSync={lastSync}
          sync={patient.sync}
        />
      </Page>
    );
  }

}

export default translate("patient-report")(PatientSummary);
