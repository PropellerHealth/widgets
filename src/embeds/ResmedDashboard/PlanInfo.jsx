import React from "react";
import moment from "moment-timezone";
import { Row, Col } from "react-bootstrap";
import ReactFauxDOM from "react-faux-dom";
import { scaleUtc } from "d3-scale";
import { select as d3Select } from "d3-selection";
import { utcDay, timeDay, timeMonth, utcMonday } from "d3-time";
import { axisBottom } from "d3-axis";
import { timeFormat, isoParse } from "d3-time-format";
import { scaleLinear } from "d3-scale";
import { axisLeft } from "d3-axis";
import { max as d3Max } from "d3-array";
import { area as d3Area, line as d3Line, curveBasis } from "d3-shape";

import { COLORS, displayedDate, capitalize } from "../../utilities";
import GreyText from "../../components/GreyText";

const tzone = moment.tz.guess();

const plan = {
  medications: [
    {
      "medication": {
        "shortName": "Spiriva",
        "name": "Spiriva Respimat",
        "type": "controller",
        "formFactor": "respimat",
        "id": "spiriva_respimat",
        "diseases": [
          "copd"
        ]
      },
      "medicationId": "spiriva_respimat",
      "sensors": [
        {
          "firstSyncDate": "2018-04-20T19:06:55.813+00:00",
          "lastSyncDate": "2018-05-01T19:13:03.459+00:00",
          "mac": "F8:FE:5C:D4:56:2A",
          "model": "Squid",
          "batteryLevel": 59,
          "lastTransmitDevice": {
            "bluetoothStatus": "on",
            "date": "2018-05-01T19:13:03.459+00:00",
            "appVersion": "4.3.0",
            "operatingSystem": "android"
          }
        }
      ],
      "usageList": [
        {
          "doses": 2,
          "hour": 16,
          "minute": 30
        }
      ]
    },
    {
      "medication": {
        "shortName": "ProAir",
        "name": "ProAir",
        "type": "rescue",
        "formFactor": "mdi",
        "id": "proair",
        "diseases": [
          "asthma",
          "copd"
        ]
      },
      "medicationId": "proair",
      "sensors": [
        {
          "firstSyncDate": "2018-04-20T19:07:00.530+00:00",
          "lastSyncDate": "2018-05-01T19:12:25.278+00:00",
          "mac": "F8:FE:5C:44:1D:5D",
          "model": "BLE1",
          "batteryLevel": 59,
          "lastTransmitDevice": {
            "bluetoothStatus": "on",
            "date": "2018-05-01T19:12:25.278+00:00",
            "appVersion": "4.3.0",
            "operatingSystem": "android"
          }
        }
      ],
      "usageList": []
    }
  ]
};

const days = [
  {
    "date": "2018-04-20T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 2,
      "dosesTakenActual": 2,
      "percent": 100,
      "percentActual": 100,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 2,
          "dosesTakenActual": 2,
          "percent": 100,
          "percentActual": 100
        }
      ]
    },
    "rescue": {
      "totalEvents": 1,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-19T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 2,
      "dosesTakenActual": 2,
      "percent": 100,
      "percentActual": 100,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 2,
          "dosesTakenActual": 2,
          "percent": 100,
          "percentActual": 100
        }
      ]
    },
    "rescue": {
      "totalEvents": 0,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-18T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 2,
      "dosesTakenActual": 2,
      "percent": 100,
      "percentActual": 100,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 2,
          "dosesTakenActual": 2,
          "percent": 100,
          "percentActual": 100
        }
      ]
    },
    "rescue": {
      "totalEvents": 1,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-17T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 1,
      "dosesTakenActual": 1,
      "percent": 50,
      "percentActual": 50,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 1,
          "dosesTakenActual": 1,
          "percent": 50,
          "percentActual": 50
        }
      ]
    },
    "rescue": {
      "totalEvents": 0,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-16T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 2,
      "dosesTakenActual": 2,
      "percent": 100,
      "percentActual": 100,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 2,
          "dosesTakenActual": 2,
          "percent": 100,
          "percentActual": 100
        }
      ]
    },
    "rescue": {
      "totalEvents": 0,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-15T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 0,
      "dosesTakenActual": 0,
      "percent": 0,
      "percentActual": 0,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 0,
          "dosesTakenActual": 0,
          "percent": 0,
          "percentActual": 0
        }
      ]
    },
    "rescue": {
      "totalEvents": 0,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-14T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 2,
      "dosesTakenActual": 2,
      "percent": 100,
      "percentActual": 100,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 2,
          "dosesTakenActual": 2,
          "percent": 100,
          "percentActual": 100
        }
      ]
    },
    "rescue": {
      "totalEvents": 1,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-13T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 0,
      "dosesTakenActual": 0,
      "percent": 0,
      "percentActual": 0,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 0,
          "dosesTakenActual": 0,
          "percent": 0,
          "percentActual": 0
        }
      ]
    },
    "rescue": {
      "totalEvents": 0,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-12T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 2,
      "dosesTakenActual": 2,
      "percent": 100,
      "percentActual": 100,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 2,
          "dosesTakenActual": 2,
          "percent": 100,
          "percentActual": 100
        }
      ]
    },
    "rescue": {
      "totalEvents": 1,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-11T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 1,
      "dosesTakenActual": 1,
      "percent": 50,
      "percentActual": 50,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 1,
          "dosesTakenActual": 1,
          "percent": 50,
          "percentActual": 50
        }
      ]
    },
    "rescue": {
      "totalEvents": 1,
      "nightEvents": 0,
      "baseline": 0
    }
  },
  {
    "date": "2018-04-10T00:00:00.000+00:00",
    "controller": {
      "dosesExpected": 2,
      "dosesTaken": 1,
      "dosesTakenActual": 1,
      "percent": 50,
      "percentActual": 50,
      "meds": [
        {
          "mid": "spiriva_respimat",
          "dosesExpected": 2,
          "dosesTaken": 1,
          "dosesTakenActual": 1,
          "percent": 50,
          "percentActual": 50
        }
      ]
    },
    "rescue": {
      "totalEvents": 1,
      "nightEvents": 0,
      "baseline": 0
    }
  }
];

const controllerSchedule = (usageList) => {
  if (!usageList || usageList.length === 0)  return  "Taken as needed";

  const doses = usageList[0].doses;
  const times = usageList.map(u =>
    displayedDate(
      moment().hour(u.hour).minute(u.minute),
      "LT"
    )
  );
  const schedule =
    times.length === 0
      ? "Taken as needed"
      : `(${times.join(", ")})`;

  const inhalation = doses === 1 ? "inhalation" : "inhalations";

  return `${doses} ${inhalation}, ${times.length}x/day, ${schedule}`;
};

const sensorInfo = sensors => {
  if (!sensors || sensors.length === 0) {
    return "No associated sensors";
  }

  return (
    <div>
      <div>Last sync: {moment(sensors[0].lastSyncDate).tz(tzone).format("lll")}</div>
    </div>
  );
};

const isMedType = type => m => type === m.medication.type;

const medMapper = type => (m, i) => {
  const data = days.slice(0, 8).map((day, j) => {
    return {
      date  : moment().subtract(i, "days"),
      value : type === "controller"
        ? day.controller.percentActual
        : day.rescue.totalEvents
    };
  });

  return (
    <Col key={`${type}-${i}`} xs={12} sm={6}>
      <h3>{m.medication.shortName}</h3>
      {controllerSchedule(m.usageList)}
      <br />
      {/* <GreyText>{capitalize(type)} medication</GreyText>
      <br /> */}
      {sensorInfo(m.sensors)}
      {renderChart({data, type})}
    </Col>);
};

const renderChart = (args) => {
  const {
    data = [],
    height = 150,
    width = 150,
    margin = 10,
    graphHeight = 140,
    graphWidth = 140
  } = args;

  const DARK_GREY  = COLORS.darkGrey;
  const LIGHT_GREY = COLORS.lightGrey;
  const FONT_SIZE = "12px";

  const scaleForY = percent => Math.round(percent || 0);

  const x = scaleUtc()
    .domain([data[data.length - 1].date, utcDay.offset(data[0].date + 1)])
    .range([0, width])
    .clamp(true)
    .nice(utcDay);

  const y = scaleLinear()
    .domain([0, d3Max(data.map(d => d.value))])
    .range([graphHeight, 0]);

  const bottomAxis = axisBottom(x)
    .ticks(timeDay)
    .tickSize(0)
    .tickPadding(10)
    .tickFormat(d => timeFormat("%-d")(isoParse(d)));

  const leftAxis = axisLeft(y)
    .ticks(5)
    .tickPadding(5)
    .tickSize(0)
    .tickFormat(val => `${val}%`);

  let el = ReactFauxDOM.createElement("div");

  let svg = d3Select(el)
    .append("svg")
      .attr("height", height)
      .attr("width", width)
    .append("g")
      .attr("transform", `translate(${margin}, ${margin})`);

  svg.append("g")
    .attr("class", "y axis left-axis")
    .attr("transform", "translate(0, 0)")
    .call(g => {
      g.call(leftAxis);
      g.select(".domain")
        .attr("stroke", DARK_GREY);
      g.selectAll(".tick text")
        .attr("fill", DARK_GREY)
        .style("fontSize", FONT_SIZE);
    });

  svg.append("g")
    .attr("class", "x axis bottom-axis")
    .attr("transform", `translate(0, ${graphHeight})`)
    .call(g => {
      g.call(bottomAxis);
      g.select(".domain")
        .attr("stroke", DARK_GREY);
      g.selectAll(".tick text")
        .attr("fill", DARK_GREY)
        .style("text-anchor", "middle")
        .style("fontSize", FONT_SIZE);
    });

    let area = d3Area()
        .curve(curveBasis)
        .x(d => x(d.date))
        .y0(y(0))
        .y1(d => y(scaleForY(d.values ? d.values.percent : 0)));

      let line = d3Line()
        .curve(curveBasis)
        .x(d => x(d.date))
        .y(d => y(scaleForY(d.values ? d.values.percent : 0)));

      svg.append("path")
        .datum(data)
        .attr("fill", COLORS.blue)
        .attr("fill-opacity", "0.35")
        .attr("class", "area")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("d", area)
        .attr("transform", "translate(0, 0)");

      // add the valueline path.
      svg.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line)
        .attr("stroke", COLORS.blue)
        .attr("fill", "none")
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke-width", 2);

  return el.toReact();
};

class PlanInfo extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.renderChart = this.renderChart.bind(this);
  // }



  render() {
    const rescue     = plan.medications.filter(isMedType("rescue"));
    const controller = plan.medications.filter(isMedType("controller"));

    return (
      <Row>
        <Col xs={12}><h4>Treatment Plan</h4></Col>
        {rescue.map(medMapper("rescue"))}
        {controller.map(medMapper("controller"))}
      </Row>
    );
  }
};

export default PlanInfo;
