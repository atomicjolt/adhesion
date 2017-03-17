import React              from 'react';
import { connect }        from 'react-redux';
import _                  from 'lodash';
import AnalyticRow        from './analytic_row';
import { switchView }     from '../../actions/analytics';

export class AnalyticList extends React.Component {

  static propTypes = {
    switchView: React.PropTypes.func.isRequired,
    tableData: React.PropTypes.array,
    view: React.PropTypes.view,
  }

  constructor() {
    super();
    this.state = {
      analyticsName: '',
    };
  }
  componentWillMount() {
    this.setAnalyticsName(this.props.view);
  }

  componentWillReceiveProps(nextProps) {
    this.setAnalyticsName(nextProps.view);
  }

  setAnalyticsName(view) {
    if (view === 'student') {
      this.setState({ analyticsName: 'Activity' });
    } else {
      this.setState({ analyticsName: 'Student' });
    }
  }

  switchTable(viewId) {
    this.props.switchView(this.state.analyticsName.toLowerCase(), viewId);
  }

  render() {
    return (
      <table className="c-aa-table">
        <thead>
          <tr>
            <th>{this.state.analyticsName}</th>
            <th>Passed</th>
            <th>AVG Score</th>
            <th>AVG Time(mins)</th>
          </tr>
        </thead>
        <tbody>
          {
            _.map(this.props.tableData, (reg, key) => (
              <AnalyticRow
                key={key}
                id={reg.id}
                name={reg.name}
                passed={reg.passed}
                score={reg.score}
                time={reg.time}
                switchTable={this.switchTable.bind(this)}
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
