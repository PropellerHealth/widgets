import React              from "react";
import { Grid, Row, Col } from "react-bootstrap";

import SearchScreen   from "./SearchScreen";
import doctorStanding from "../../assets/images/img_docstanding.png";

const FirstScreen = (props) => {
  return (
    <Grid>
      <Row className="show-grid">
        <Col sm={6} smPush={6}>
          <img className="img-responsive hidden-xs" src={doctorStanding} alt=""/>
        </Col>
        <Col sm={6} smPull={6}>
          <h1 style={{ fontSize: "2.75rem", textAlign: "center", width: "100%"}}>
            Keep Your Doc in the Loop.
          </h1>
          <br/>
          <p style={{ fontSize: "1.75rem", textAlign: "center", width: "100%"}}>
            Connect your doctor to Propeller and we will send them your wellness report every 3 months.
          </p>
          <br/>
          <SearchScreen {...props} />
        </Col>
      </Row>
    </Grid>
  );
};

export default FirstScreen;