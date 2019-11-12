import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router3';
import { switchView } from '../../actions/analytics';

export class Header extends React.Component {

  static propTypes = {
    title: PropTypes.string,
    studentName: PropTypes.string,
    view: PropTypes.string,
    switchView: PropTypes.func.isRequired,
  }

  switchTable(view) {
    this.props.switchView(view);
  }

  render() {
    let studentName = this.props.studentName;
    let allAnalyticButton;
    let backButton;
    if (studentName) {
      studentName = ` / ${this.props.studentName}`;
    }
    if (this.props.view === 'course') {
      allAnalyticButton = (
        <button
          className="c-aa-btn"
          onClick={() => this.switchTable('activities')}
        >
          View Course Activities
        </button>
      );
      backButton = (
        <Link
          className="c-aa-back-btn"
          to={{ pathname: '/', query: { noSync: true } }}
        >
          <i className="material-icons">arrow_back</i>
        </Link>
      );
    } else {
      backButton = (
        <div
          className="c-aa-back-btn"
          onClick={() => this.switchTable('course')}
        >
          <i className="material-icons">arrow_back</i>
        </div>
      );
    }
    return (
      <header className="c-aa-head">
        {backButton}
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
