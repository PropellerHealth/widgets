import React, { Component } from "react";
import { Grid, Button }     from "react-bootstrap";

const styles = {
  button : {
    display         : "inline-block",
    float           : "center",
    width           : "50%",
    marginTop       : "15px",
    padding         : "12px 0",
    fontSize        : "1.75rem",
    textAlign       : "center",
    backgroundColor : "gray",
    color           : "#FFF",
    cursor          : "pointer"
  }
};

class SearchList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      doctors : props.doctors
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(doctor) {
    const { goNext, goToStart, passThatDocAlong } = this.props;
    
    if (!doctor) {
      goToStart();
    } 
    else {
      passThatDocAlong(doctor);
      goNext();
    }
  }

  render() {
    const doctors = this.state.doctors;

    return (
      <div>
        {doctors.length === 0 &&
        <div>
          <div
            className="row"
          >
            <div
              className="col-md-8 col-md-6 col-md-offset-2"
              style={{
                position  : "static",
                textAlign : "center"
              }}
            >
              <h1
                style={{
                  color : "gray"
                }}
              >Sorry we were unable to find your doctor</h1>
            </div>
            <hr/>
          </div>
          <div
            className="row"
          >
            <div
              className="col-md-8 col-md-6 col-md-offset-2"
              style={{
                position  : "static",
                textAlign : "center",
                marginTop : "15px"
              }}
            >
              <h2>Search Tips</h2>
            </div>
          </div>
          <div
            className="row"
          >
            <div
              className="col-md-8 col-md-6 col-md-offset-2"
              style={{
                position  : "static",
                textAlign : "center"
              }}
            >
              <ul 
                className="text-left" 
                style={{
                  display       : "inline-block",
                  verticalAlign : "middle"
                }}
              >
                <li>Check your spelling and try again</li>
                <li>Search by last name only</li>
                <li>Verify your doctor's primary location</li>
              </ul>
            </div>
          </div>
          <div
            className="row"
            style={{
              textAlign : "center",
              marginTop : "45px"
            }}
          >
            <Button
              style={styles.button}
              onClick={() => this.handleClick()}>
              Back to Search
            </Button>
          </div>
        </div>
        }
        {doctors.length > 0 &&
        <form onSubmit={this.onSubmit}>
          <Grid>
            <div className="row">
              <div className="col-xs-6 col-md-8">
                <h2>Select a doctor</h2>
              </div>
              <div 
                className="col-xs-6 col-md-4"
                style={{textAlign: "center"}}
              >
              </div>
            </div>
            {
              doctors.map(doctor => {
                return(
                  <div key={doctor.uid}>
                    <div
                      style={{position: "relative"}} 
                      className="row">
                      <div className="col-xs-6 col-md-8">
                        <h3
                          style={{fontSize:"1.5rem"}}
                        >{doctor.profile.first_name} {doctor.profile.last_name}<br/>
                        </h3>
                        {(doctor.specialties[0]) && <p>{doctor.specialties[0].name}</p>}
                        {doctor.practices[0]    &&  <p>{doctor.practices[0].visit_address.street}, {doctor.practices[0].visit_address.street2} <br/>
                          {doctor.practices[0].visit_address.city}, {doctor.practices[0].visit_address.state} {doctor.practices[0].visit_address.zip}</p>}
                      </div>
                      <div 
                        className="col-xs-6 col-md-4"
                        style={{
                          position  : "static",
                          textAlign : "center"
                        }}
                      >
                        <Button
                          style={{
                            position  : "absolute",
                            top       : "50%",
                            marginTop : "-17px"
                          }}
                          bsStyle="success"
                          onClick={() => this.handleClick(doctor)}>
                          Select
                        </Button>
                      </div>
                    </div>
                    <hr/>
                  </div>
                );
              })
            }
          </Grid>
          <div
            className="row"
            style={{
              textAlign : "center",
              marginTop : "45px"
            }}
          >
            <Button
              style={styles.button}
              onClick={() => this.handleClick()}>
              Back to Search
            </Button>
          </div>
        </form>
        }
      </div>
    );
  }
}

export default SearchList;