import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import AnalyticRow from './analytic_row';
import { switchView } from '../../actions/analytics';

export class AnalyticList extends React.Component {

  static propTypes = {
    switchView: React.PropTypes.func.isRequired,
    tableData: React.PropTypes.array,
    view: React.PropTypes.string.isRequired,
  }

  constructor() {
    super();
    this.state = {
      analyticsName: '',
      parents: {},
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
    if (this.props.view === 'course' && viewId) {
      this.props.switchView('student', viewId);
    } else {
      const parent = _.find(this.state.parents, { id: viewId });
      if (parent) {
        const show = !parent.show;
        const parents = this.hideChildren(this.state.parents, viewId, show);
        this.setState({ parents });
      }
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

  render() {
    return (
      <table className="c-aa-table">
        <thead>
          <tr>
            <th>{this.state.analyticsName}</th>
            <th>Passed</th>
            <th>AVG Score</th>
            <th>Total Time(mins)</th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(this.props.tableData, (reg, key) => {
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
          }
        </tbody>
      </table>
    );
  }
}

const select = state => ({
  view: state.analytics.view,
});

export default connect(select, { switchView })(AnalyticList);
