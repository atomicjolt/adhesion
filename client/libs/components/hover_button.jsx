import React from 'react';

export default class HoverButton extends React.Component {

  static propTypes = {
    onClick: React.PropTypes.func,
    style: React.PropTypes.shape({}),
    className: React.PropTypes.string,
    children: React.PropTypes.node,
    hoveredStyle: React.PropTypes.shape({}),
    ariaLabel: React.PropTypes.string,
    ariaDescribedBy: React.PropTypes.string,
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
        aria-label={this.props.ariaLabel}
        aria-describedby={this.props.ariaDescribedBy}
      >
        {this.props.children}
      </button>
    );
  }
}
