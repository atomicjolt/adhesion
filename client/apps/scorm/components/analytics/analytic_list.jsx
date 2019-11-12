import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import AnalyticRow from './analytic_row';
import { switchView } from '../../actions/analytics';

export class AnalyticList extends React.Component {

  static propTypes = {
    switchView: PropTypes.func.isRequired,
    tableData: PropTypes.array,
    view: PropTypes.string.isRequired,
  }

  constructor() {
    super();
    this.state = {
      analyticsName: '',
      parents: {},
      sortAsc: true,
      sortBy: 'name',
    };
  }
  componentWillMount() {
    this.setAnalyticsName(this.props.view);
    this.setParent(this.props.tableData);
  }

  componentWillReceiveProps(nextProps) {
    this.setAnalyticsName(nextProps.view);
    this.setParent(nextProps.tableData);
  }

  setAnalyticsName(view) {
    if (view === 'course') {
      this.setState({ analyticsName: 'Student' });
    } else {
      this.setState({ analyticsName: 'Activity' });
    }
  }

  setParent(tableData) {
    let parents = _.map(tableData, (reg) => {
      const data = {};
      if (_.size(reg.childrenIds) > 0) {
        data.id = reg.id;
        data.show = true;
        data.childrenIds = reg.childrenIds;
      }
      return data;
    });
    parents = _.remove(parents, {});
    this.setState({ parents });
  }

  tableRowClicked(viewId) {
    const parent = _.find(this.state.parents, { id: viewId });
    if (parent) {
      const show = !parent.show;
      const parents = this.hideChildren(this.state.parents, viewId, show);
      this.setState({ parents });
    }
  }

  hideChildren(parents, id, show) {
    const data = _.find(parents, { id });
    if (data) {
      data.show = show;
      if (data.childrenIds) {
        _.each(data.childrenIds, (childId) => {
          this.hideChildren(parents, childId, show);
        });
      }
    }
    return parents;
  }

  sort(col) {
    this.setState(prevState => (
      {
        sortAsc: !prevState.sortAsc,
        sortBy: col,
      }
    ));
  }

  sortIcon(key) {
    if (this.state.sortBy === key && this.props.view === 'course') {
      if (this.state.sortAsc) return 'keyboard_arrow_up';
      return 'keyboard_arrow_down';
    }
    return null;
  }

  data() {
    const asc = this.state.sortAsc ? 'asc' : 'desc';
    const data = this.props.view === 'course' ?
      _.orderBy(this.props.tableData, [this.state.sortBy], [asc]) :
      this.props.tableData;
    return (
      _.map(data, (reg, key) => {
        const parent = _.find(this.state.parents, { id: reg.parentId });
        return (<AnalyticRow
          key={key}
          id={parseInt(reg.id, 10)}
          name={reg.name}
          passed={reg.passed}
          score={reg.score}
          time={reg.time}
          show={parent ? parent.show : true}
          isParent={_.size(reg.childrenIds) > 0}
          depth={reg.depth}
          tableRowClicked={viewId => this.tableRowClicked(viewId)}
        />);
      })
    );
  }

  tableHeaders() {
    const headers = [
      { name: 'name', label: this.state.analyticsName },
      { name: 'passed', label: 'Passed' },
      { name: 'score', label: 'AVG Score' },
      { name: 'time', label: 'Total Time(mins)' },
    ];

    return (
      _.map(headers, header => (
        <th
          key={header.name}
          onClick={() => { this.sort(header.name); }}
        >
          {header.label}
          <i className="material-icons">
            {this.sortIcon(header.name)}
          </i>
        </th>
      ))
    );
  }

  render() {

    return (
      <table className="c-aa-table">
        <thead>
          <tr>
            { this.tableHeaders() }
          </tr>
        </thead>
        <tbody>
          { this.data() }
        </tbody>
      </table>
    );
  }
}

const select = state => ({
  view: state.analytics.view,
});

export default connect(select, { switchView })(AnalyticList);
