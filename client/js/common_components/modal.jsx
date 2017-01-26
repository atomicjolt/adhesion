import React from 'react';

export default class Modal extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    visible: React.PropTypes.bool
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
      zIndex: '1',
    };

    if (!this.props.visible) { return null; }
    return (
      <div>
        {this.props.children}
        <div style={overlayStyle} />
      </div>
    );
  }
}
