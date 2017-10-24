import React, { Component } from "react";
import { Grid, Button }     from "react-bootstrap";

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
      <form onSubmit={this.onSubmit}>
        <Grid>
          <div className="row">
            <div className="col-xs-6 col-md-8">
              <h2>Select a doctor</h2>
              <Button
                onClick={() => this.handleClick()}>
                Back to Search
              </Button>
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
                        {doctor.specialties[0].name}</h3>
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
      </form>
    );
  }
}

export default SearchList;