import React, { Component } from "react";

import FirstScreen    from "./FirstScreen";
import SearchList     from "./SearchList";
import ConfirmDoctor  from "./ConfirmDoctor";
import Success        from "./Success";
import propellerLogo  from "../../assets/images/propeller-logo-white.svg";

const ORDER = [
  FirstScreen,
  SearchList,
  ConfirmDoctor,
  Success
];

class FindMyDoctor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idx     : 0,
      doctors : [],
      doctor  : {}
    };
    this.goNext                     = this.goNext.bind(this);
    this.goToStart                  = this.goToStart.bind(this);
    this.updateOrSomethingLikeThat  = this.updateOrSomethingLikeThat.bind(this);
    this.passThatDocAlong           = this.passThatDocAlong.bind(this);
  }

  goNext() {
    this.setState({idx: this.state.idx + 1 });
  }

  goToStart() {
    this.setState({idx: 0});
  }

  updateOrSomethingLikeThat(doctors) {
    this.setState({doctors});
  }

  passThatDocAlong(doctor) {
    this.setState({doctor});
  }

  render() {
    const ToRender = ORDER[this.state.idx];

    return (
      <div>
        <div className="navbar navbar-default navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <img src={propellerLogo} alt="" height="54" width="180"/>
            </div>
          </div>
        </div>
        <div style={{marginBottom: "250px"}}>
        <ToRender
          goNext={this.goNext} 
          goToStart={this.goToStart} 
          updateOrSomethingLikeThat={this.updateOrSomethingLikeThat} 
          passThatDocAlong={this.passThatDocAlong} 
          {...this.state} 
        />
        </div>
        <br/>
        <footer>
          <div className="container">
          </div>
        </footer>
      </div>
    );
  }
}

export default FindMyDoctor;