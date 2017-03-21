import React                from 'react';
import { connect }        from 'react-redux';
import { hashHistory }      from 'react-router';
import { switchView }     from '../../actions/analytics';

export class Header extends React.Component {

  static propTypes = {
    title: React.PropTypes.string,
    switchView: React.PropTypes.func.isRequired,
    studentName: React.PropTypes.string,
    view: React.PropTypes.string,
  }

  switchTable(view) {
    this.props.switchView(view);
  }

  render() {
    let studentName = this.props.studentName;
    let allAnalyticButton;
    if (studentName) {
      studentName = ` / ${this.props.studentName}`;
    }
    if (this.props.view === 'course') {
      allAnalyticButton = (<button
        className="c-aa-btn"
        onClick={() => this.switchTable('activities')}
      >
        View Course Activities
      </button>);
    }
    return (
      <header className="c-aa-head">
        <a
          className="c-aa-back-btn"
          onClick={() => hashHistory.push('/')}
        >
          <i className="material-icons">arrow_back</i>
        </a>
        <h1 className="c-aa-title">
          <span
            className="c-aa-title-btn"
            onClick={() => this.switchTable('course')}
          >
            {`${this.props.title} Analytics`}
          </span>
          {studentName}
        </h1>
        { allAnalyticButton }
      </header>
    );
  }
}

const select = state => ({
  view: state.analytics.view,
});

export default connect(select, { switchView })(Header);
