import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

export class AnalyticRow extends React.Component {

  static propTypes = {
    id: PropTypes.number,
    name: PropTypes.string,
    passed: PropTypes.string,
    score: PropTypes.number,
    time: PropTypes.number,
    isParent: PropTypes.bool,
    show: PropTypes.bool,
    depth: PropTypes.number,
    tableRowClicked: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      isOpen: true,
    };
  }

  formatScore() {
    if (this.props.score || this.props.score === 0) {
      return `${this.props.score * 100}%`;
    }
    return 'N/A';
  }

  formatTime() {
    if (this.props.time < 60) {
      return `${this.props.time}s`;
    }
    return `${_.ceil(this.props.time / 60)}m`;
  }

  rowClicked(viewId) {
    if (!(this.props.depth >= 0) && viewId) {
      this.props.tableRowClicked(viewId);
    } else if (this.props.isParent) {
      this.setState({ isOpen: !this.state.isOpen });
      this.props.tableRowClicked(viewId);
    }
  }

  render() {
    let rowStyles = {};
    let iconStyles = {};
    let firstColumnStyle = {};
    let tableClass = 'c-aa-row';
    let icon;
    if (this.props.depth) {
      const totalDepth = 2 * this.props.depth;
      const iconLeft = totalDepth + 1.3;
      const rowLeft = totalDepth + 4;
      iconStyles = {
        left: `${iconLeft}rem`,
      };
      firstColumnStyle = {
        paddingLeft: `${rowLeft}rem`,
      };
    }
    if (this.props.show) {
      if (this.props.isParent || !(this.props.depth >= 0)) {
        rowStyles = {
          cursor: 'pointer',
        };
        if (this.props.isParent) {
          tableClass += ` c-aa-accordion ${this.state.isOpen ? 'is-open' : ''}`;
          icon = <i style={iconStyles} className="material-icons">arrow_drop_down</i>;
        }
      }
    } else {
      rowStyles = {
        display: 'none',
      };
    }

    return (
      <tr
        className={tableClass}
        onClick={() => this.rowClicked(this.props.id)}
        style={rowStyles}
      >
        <td style={firstColumnStyle}>{icon}{this.props.name || 'Unknown'}</td>
        <td>{this.props.passed}</td>
        <td>{this.formatScore()}</td>
        <td>{this.formatTime()}</td>
      </tr>
    );
  }
}

export default AnalyticRow;
