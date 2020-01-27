import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { getSubAccountsOfAccount } from 'atomic-canvas/libs/constants/accounts';
import canvasRequest from 'atomic-canvas/libs/action';
import Defines from '../../defines';
import * as ExamActions from '../../actions/exams';
import appHistory from '../../history';
import HoverButton from '../common/hover_button';
import CenterError from '../common/center_error';
import ProctorCenterSelector from './proctor_center_selector';

const select = (state, props) => {
  const exam = _.find(state.exams.examList, ex => props.params.id === ex.id.toString());
  return {
    lmsCourseId: state.settings.lms_course_id,
    lmsUserId: state.settings.lms_user_id,
    lmsCourseName: state.settings.lms_course_name,
    exam,
    studentName: state.settings.display_name,
    testingCentersAccountId: state.testingCenters.testingCentersAccount.testing_centers_account_id,
    testingCenterList: state.testingCenters.testingCenterList,
  };
};

export class BaseScheduleExam extends React.Component {

  static propTypes = {
    canvasRequest: PropTypes.func.isRequired,
    lmsCourseId: PropTypes.string.isRequired,
    lmsUserId: PropTypes.string.isRequired,
    lmsCourseName: PropTypes.string.isRequired,
    exam: PropTypes.shape({ title: PropTypes.string }),
    testingCenterList: PropTypes.shape({}),
    params: PropTypes.shape({ id: PropTypes.string.isRequired }),
    requestExam: PropTypes.func.isRequired,
    testingCentersAccountId: PropTypes.number.isRequired,
    studentName: PropTypes.string.isRequired,
    clearState: PropTypes.func.isRequired,
  };

  static getStyles() {
    return {
      table: {
        borderCollapse: 'collapse',
        width: '100%',
      },
      header: {
        color: Defines.darkGrey,
        marginBottom: '0px',
      },
      examName: {
        marginTop: '0px',
        color: Defines.darkGrey,
        fontWeight: 'bold'
      },
      tr: {
        backgroundColor: Defines.lightBackground,
        color: Defines.lightText,
      },
      th: {
        fontWeight: 'normal',
        textAlign: 'left',
        padding: '15px 20px',
      },
      smaller: {
        width: '15%',
      },
      larger: {
        width: '35%',
      },
      button: {
        content: '\u25BE'
      },
      ad: {
        cursor: 'pointer',
        border: 'none',
        backgroundColor: 'inherit',
        fontWeight: 'normal',
        color: Defines.lightText,
        fontSize: 'inherit',
      },
      regular: {
        width: '20%',
      },
      floatRight: {
        float: 'right',
        padding: '10px 15px',
        borderRadius: '0',
        backgroundColor: Defines.lightBackground,
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        marginLeft: '5px'
      },
      instructions: {
        color: Defines.darkGrey,
      },
      testingCenter: {
        marginTop: '30px',
        marginBottom: '5px',
        color: Defines.mediumText,
      },
      messageHeader: {
        marginTop: '10px',
        marginBottom: '5px',
        color: Defines.mediumText,
      },
      textarea: {
        width: '50%',
        border: `2px solid ${Defines.lightBorder}`,
        padding: '5px',
        fontSize: '.9em',
      },
      buttonContainer: {
        width: '50%',
      },
      requestButton: {
        border: 'none',
        padding: '10px 20px',
        backgroundColor: Defines.tanishBrown,
        color: 'white',
        cursor: 'pointer',
        float: 'right',
        margin: '20px -13px 0px 0px',
      }
    };
  }

  constructor() {
    super();
    this.state = {
      centerError: false,
      selectedCenterId: null,
    };

    this.messageField = null;
  }

  componentWillMount() {
    this.getTestingCenters();
  }

  getTestingCenters() {
    const testingId = this.props.testingCentersAccountId || -1;
    if (testingId !== -1) {
      const params = {
        account_id: testingId
      };
      this.props.canvasRequest(getSubAccountsOfAccount, params);
    } else {
      this.setState({ testingCenterError: true });
    }
  }

  requestExam() {
    const body = {
      exam_id: this.props.params.id,
      testing_center_name: this.props.testingCenterList[this.state.selectedCenterId].name,
      course_id: this.props.lmsCourseId,
      student_id: this.props.lmsUserId,
      testing_center_id: this.state.selectedCenterId,
      student_name: this.props.studentName,
      exam_name: this.props.exam.title,
      course_name: this.props.lmsCourseName,
      message: this.messageField.value,
    };
    this.props.requestExam(body);
    this.goBack();
  }

  goBack() {
    this.props.clearState();
    appHistory.push('/');
  }

  render() {
    const styles = BaseScheduleExam.getStyles();
    const defaultValue = 'e.g I would like to take it on Tuesday sometime between 0900 and 1100 PST.';
    return (
      <div>
        { this.state.centerError ? <CenterError /> : null }
        <h2 style={styles.header}>
          Request Exam
          <HoverButton
            className="spec_back qa-back-btn"
            style={styles.floatRight}
            onClick={() => this.goBack()}
          >
            <i className="material-icons">arrow_back</i>
          </HoverButton>
        </h2>
        <h3 style={styles.examName}>{this.props.exam.title}</h3>
        <div style={styles.instructions}>
          <div>
            Please choose a testing center and enter a message
            including when you want to take the exam.
          </div>
          <div>
            (your requested date is not guaranteed until confirmed by the testing center.)
          </div>
        </div>
        <h5 style={styles.testingCenter}>TESTING CENTER</h5>
        <ProctorCenterSelector
          testingCenterList={this.props.testingCenterList}
          onChange={option => this.setState({ selectedCenterId: option.value })}
        />

        <h5 style={styles.messageHeader}>MESSAGE</h5>
        <textarea
          style={styles.textarea}
          rows="15"
          ref={(el) => { this.messageField = el; }}
          placeholder={defaultValue}
        />
        <div style={styles.buttonContainer}>
          <HoverButton
            className="qa-request-exam-btn"
            style={styles.requestButton}
            onClick={() => this.requestExam()}
          >
            REQUEST EXAM
          </HoverButton>
          <div style={{ clear: 'both' }} />
        </div>
      </div>
    );
  }
}

export default connect(select, { canvasRequest, ...ExamActions })(BaseScheduleExam);
