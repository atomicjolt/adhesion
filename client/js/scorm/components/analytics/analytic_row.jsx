import React  from 'react';
import _ from 'lodash';

export class AnalyticRow extends React.Component {

  static propTypes = {
    id: React.PropTypes.number,
    name: React.PropTypes.string,
    passed: React.PropTypes.string,
    score: React.PropTypes.number,
    time: React.PropTypes.number,
    isParent: React.PropTypes.bool,
    show: React.PropTypes.bool,
    depth: React.PropTypes.number,
    switchTable: React.PropTypes.func.isRequired,
    toggleHideShow: React.PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.state = {
      isOpen: true,
    };
  }

  formatScore(score) {
    if (score || score === 0) {
      return `${score * 100}%`;
    }
    return 'N/A';
  }

  formatTime(time) {
    return _.ceil(time / 60);
  }

  rowClicked(viewId) {
    if (!(this.props.depth >= 0) && viewId) {
      this.props.switchTable(viewId);
    } else if (this.props.isParent) {
      this.setState({ isOpen: !this.state.isOpen });
      this.props.toggleHideShow(viewId);
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
    if (this.props.isParent || !(this.props.depth >= 0)) {
      rowStyles = {
        cursor: 'pointer',
      };
      if (this.props.isParent) {
        tableClass += ` c-aa-accordion ${this.state.isOpen ? 'is-open' : ''}`;
        icon = <i style={iconStyles} className="material-icons">arrow_drop_down</i>;
      }
    }
    if (!this.props.show) {
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
        <td>{this.formatScore(this.props.score)}</td>
        <td>{this.formatTime(this.props.time)}</td>
      </tr>
    );
  }
}

export default AnalyticRow;
