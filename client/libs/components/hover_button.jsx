import React from 'react';
import PropTypes from 'prop-types';

export default class HoverButton extends React.Component {

  static propTypes = {
    onClick: PropTypes.func,
    style: PropTypes.shape({}),
    className: PropTypes.string,
    children: PropTypes.node,
    hoveredStyle: PropTypes.shape({}),
  }

  constructor() {
    super();
    this.state = {
      hovered: false,
    };
  }

  render() {
    const style = this.state.hovered ? {
      ...this.props.style, ...this.props.hoveredStyle
    } : this.props.style;

    return (
      <button
        className={this.props.className}
        onClick={this.props.onClick}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        style={style}
      >
        {this.props.children}
      </button>
    );
  }
}
