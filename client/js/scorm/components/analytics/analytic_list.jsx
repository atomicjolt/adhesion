import React              from 'react';
import { connect }        from 'react-redux';
import _                  from 'lodash';
import AnalyticRow        from './analytic_row';
import { switchView }     from '../../actions/analytics';

export class AnalyticList extends React.Component {

  static propTypes = {
    switchView: React.PropTypes.func.isRequired,
    tableData: React.PropTypes.array,
    view: React.PropTypes.string,
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
    let parents = _.map(tableData, reg => {
      if(_.size(reg.childrenIds) > 0) {
        let data = {};
        data['id'] = reg.id;
        data['show'] = true;
        data['childrenIds'] = reg.childrenIds;
        return data;
      }
    });
    parents = _.remove(parents, undefined);
    this.setState({ parents });
  }

  tableRowClicked(viewId) {
    if (this.props.view == 'course' && viewId) {
      this.props.switchView('student', viewId);
    } else {
      let parent = _.find(this.state.parents, {'id': viewId});
      if (parent) {
        let show = !parent.show;
        let parents = this.hideChildren(this.state.parents, viewId, show);
        this.setState({ parents });
      }
    }
  }

  hideChildren(parents, id, show) {
    let data = _.find(parents, {'id': id});
    if(data) {
      data.show = show;
      if (data.childrenIds){
        _.each(data.childrenIds, id => {
          this.hideChildren(parents, id, show);
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
            _.map(this.props.tableData, (reg, key) => (
              <AnalyticRow
                key={key}
                id={parseInt(reg.id, 10)}
                name={reg.name}
                passed={reg.passed}
                score={reg.score}
                time={reg.time}
                show={_.find(this.state.parents, {'id': reg.parentId}) ? (_.find(this.state.parents, {'id': reg.parentId})).show : true}
                isParent={_.size(reg.childrenIds) > 0}
                depth={reg.depth}
                tableRowClicked={this.tableRowClicked.bind(this)}
              />
            ))
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
