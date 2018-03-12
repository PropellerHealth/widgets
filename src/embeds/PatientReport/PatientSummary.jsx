import React from "react";
import moment from "moment";

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

const PatientSummary = function PatientSummary({
  range,
  patient,
  rescue,
  controller = [],
  controlStatus,
  transitionAlerts
}) {
  const _controller = controller
    .map(d => frozenCopy({}, d, { date: new Date(d.date) }))
    .sort(sortDates)
    .reduce((arr, d) => arr.concat(incrementToDays(d, 7)), []);

  const meds           = patient.plan.medications || [];
  const controllerMeds = meds.filter(m => "controller" === m.medication.type);
  const rescueMeds     = meds.filter(m => "rescue" === m.medication.type);
  const controllerAvg  = Math.floor(_controller.reduce((tot, item) => tot + item.values.adherencePercent ,0) / _controller.length);

  return (
    <Page first>
      <Header timeFrame={range} disease={patient.disease} />
      <PatientInfo {...patient} rescueMeds={rescueMeds} controllerMeds={controllerMeds} />
      <PatientStatus rescue={rescue} controlStatus={controlStatus} controller={_controller} controllerAvg={controllerAvg} />
      <MedicationUsage
        rescue={rescue}
        controller={_controller}
        range={range}
        transitionAlerts={transitionAlerts}
        rescueMeds={rescueMeds}
        controllerMeds={controllerMeds}
        controllerAvg={controllerAvg}
      />
    </Page>
  );
};

export default PatientSummary;
