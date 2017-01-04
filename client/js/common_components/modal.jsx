import React from 'react';

export default class Modal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const overlayStyle = {
      position: 'fixed',
      top: '0px',
      bottom: '0px',
      right: '0px',
      left: '0px',
      backgroundColor: 'grey',
      opacity: '.6',
    };

    if (!this.props.visible) { return null; }
    return(
      <div>
        <div style={overlayStyle}/>
        {this.props.children}
      </div>
    )
  }
}


