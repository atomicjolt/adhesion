import React from 'react';

import React                    from "react";

export default class Index extends React.Component {
  render(){
    return(
      <div>
        {this.props.children}
      </div>
    );
  }
}
