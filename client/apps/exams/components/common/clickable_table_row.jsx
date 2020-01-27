import React from 'react';
import PropTypes from 'prop-types';

export default class ClickableTableRow extends React.Component {
  static propTypes = {
    style: PropTypes.shape({}),
    hoveredStyle: PropTypes.shape({}),
    children: PropTypes.node,
    onClick: PropTypes.func,
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
        className="qa-clickable-tr"
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
