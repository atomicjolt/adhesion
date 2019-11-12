import React from 'react';
import PropTypes from 'prop-types';

export default class Modal extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    visible: PropTypes.bool
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
