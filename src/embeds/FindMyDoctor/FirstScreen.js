import React              from "react";
import { Grid, Row, Col } from "react-bootstrap";

import SearchScreen   from "./SearchScreen";
import doctorStanding from "../../assets/images/img_docstanding.png";

const styles  = Object.freeze({
  header    : { 
    fontSize  : "2.75rem", 
    textAlign : "center", 
    width     : "100%"
  },
  paragraph : { 
    fontSize  : "1.75rem", 
    textAlign : "center", 
    width     : "100%"
  }
});

const strings = {
  header    : "Keep Your Doc in the Loop.",
  paragraph : "Connect your doctor to Propeller and we will send them your wellness report every 3 months."
};

const FirstScreen = (props) => {
  return (
    <Grid>
      <Row className="show-grid">
        <Col sm={6} smPush={6}>
          <div
            style={{
              marginTop : "25px"
            }}
          >
            <img className="img-responsive hidden-xs" src={doctorStanding} alt=""/>
          </div>
        </Col>
        <Col sm={6} smPull={6}>
          <h1 style={styles.header}>
            {strings.header}
          </h1>
          <br/>
          <p style={styles.paragraph}>
            {strings.paragraph}
          </p>
          <br/>
          <SearchScreen {...props} />
        </Col>
      </Row>
    </Grid>
  );
};

export default FirstScreen;