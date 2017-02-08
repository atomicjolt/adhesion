import React from 'react';

export default class ClickableTableRow extends React.Component {
  static propTypes = {
    style: React.PropTypes.shape({}),
    hoveredStyle: React.PropTypes.shape({}),
    children: React.PropTypes.node,
    onClick: React.PropTypes.func,
  };

  constructor() {
    super();
    this.state = {
      hovered: false,
    };
  }

  render() {
    const style = this.state.hovered ?
      { ...this.props.style, ...this.props.hoveredStyle }
      : this.props.style;

    return (
      <tr // eslint-disable-line jsx-a11y/no-static-element-interactions
        style={style}
        tabIndex="0"
        role="button"
        onClick={this.props.onClick}
        onMouseEnter={() => this.setState({ hovered: !this.state.hovered })}
        onMouseLeave={() => this.setState({ hovered: !this.state.hovered })}
      >
        {this.props.children}
      </tr>
    );
  }
}
