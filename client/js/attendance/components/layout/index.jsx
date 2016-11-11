"use strict";

import React                    from "react";
import { connect }              from "react-redux";

export default class Index extends React.Component {
  render(){
    return(
      <div>
        {this.props.children}
      </div>
    );
  }
}
