import React from "react";
import "./index.css";

import { HAS_WINDOW } from "../../utilities";

class TimeSeriesChart extends React.Component {
  column = undefined;

  setHeight(evt, width) {
    this.setState({
      height: this.column.clientHeight
    });
  }

  unsetHeight(evt) {
    this.setState({
      height: "auto"
    });
  }

  constructor(props) {
    super(props);
    this.setColumnRef = el => { this.column = el; };
    this.state = { height: "auto" };
    this.setHeight = this.setHeight.bind(this);
    this.unsetHeight = this.unsetHeight.bind(this);
  }

  componentDidMount() {
    if (HAS_WINDOW) {
      window.addEventListener("beforeprint", this.setHeight);
      window.addEventListener("afterprint", this.unsetHeight);
    }
  }

  componentWillUnmount() {
    if (HAS_WINDOW) {
      window.removeEventListener("beforeprint", this.setHeight);
      window.removeEventListener("afterprint", this.unsetHeight);
    }
  }

  render() {
    const { className="", style = {}, ...rest } = this.props;
    const { height } = this.state;

    return (
      <div
        ref={this.setColumnRef}
        className={`time-series-chart ${className}`}
        style={Object.assign({}, style, { height })}
        {...rest}
      />
    );
  }

}

export default TimeSeriesChart;
