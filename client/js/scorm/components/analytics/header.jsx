import React                from 'react';
import { connect }        from 'react-redux';
import { hashHistory }      from 'react-router';
import { switchView }     from '../../actions/analytics';

export class Header extends React.Component {

  static propTypes = {
    title: React.PropTypes.string,
  }

  switchTable() {
    this.props.switchView('activity');
  }

  render() {
    var studentName = this.props.studentName;
    if(studentName) {
      studentName = ` / ${this.props.studentName}`;
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
            onClick={ () => this.switchTable() } >
            { `${this.props.title} Analytics` }
          </span>
          {studentName}
        </h1>
      </header>
    );
  }
}

const select = (state, props) => ({
  view: state.analytics.view,
});

export default connect(select, {switchView})(Header);
