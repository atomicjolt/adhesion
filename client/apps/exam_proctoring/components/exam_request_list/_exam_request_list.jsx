import React                                    from 'react';
import { connect }                              from 'react-redux';
import _                                        from 'lodash';
import Fuse                                     from 'fuse.js';
import moment                                   from 'moment';
import canvasRequest                            from 'atomic-canvas/libs/action';
import { loadCustomData, storeCustomData }      from 'atomic-canvas/libs/constants/users';
import * as ExamRequestActions                  from '../../actions/exam_requests';
import * as ModalActions                        from '../../../../libs/actions/modal';
import Defines                                  from '../../defines';
import ExamRequest                              from './exam_request';
import SearchBar                                from './search_bar';
import DateFilter                               from './date_filter';
import FilterTabs                               from './filter_tabs';
import NewProctorCode                           from './new_proctor_code';
import ReportButton                             from './report_button';
import ReportWindow                             from './report_window';

const select = state => ({
  lmsUserId: state.settings.lms_user_id,
  currentAccountId: state.settings.custom_canvas_account_id,
  toolConsumerInstanceName: state.settings.tool_consumer_instance_name,
  examRequestList: state.examRequests.examRequestList,
  centerIdError: state.examRequests.centerIdError,
  needProctorCode: state.examRequests.needProctorCode
});

export class BaseExamRequestList extends React.Component {
  static propTypes = {
    loadExamRequests: React.PropTypes.func.isRequired,
    scheduleExam: React.PropTypes.func.isRequired,
    testingCentersAccountSetup: React.PropTypes.func.isRequired,
    toolConsumerInstanceName: React.PropTypes.string.isRequired,
    currentAccountId: React.PropTypes.string.isRequired,
    examRequestList: React.PropTypes.arrayOf(
      React.PropTypes.shape({})
    ).isRequired,
    hideModal: React.PropTypes.func.isRequired,
    showModal: React.PropTypes.func.isRequired,
    canvasRequest: React.PropTypes.func.isRequired,
    startExam: React.PropTypes.func.isRequired,
    enterAnswers: React.PropTypes.func.isRequired,
    finishExam: React.PropTypes.func.isRequired,
    lmsUserId: React.PropTypes.string,
    needProctorCode: React.PropTypes.bool.isRequired,
    exportExamsAsCSV: React.PropTypes.func.isRequired,
    getSignedUrl: React.PropTypes.func.isRequired,
    createProctorConversation: React.PropTypes.func.isRequired,
  };

  static tableHeader(styles) {
    return (
      <tr>
        <th style={styles.th}>STUDENT</th>
        <th style={styles.th}>EXAM</th>
        <th style={styles.th}>SCHEDULING</th>
        <th style={styles.th}>STATUS</th>
      </tr>
    );
  }

  static getStyles() {
    return {
      table: {
        borderCollapse: 'collapse',
        width: '100%',
        marginTop: '10px',
      },
      tr: {
        backgroundColor: Defines.lightBackground,
        color: Defines.lightText,
        width: '100%',
      },
      th: {
        fontWeight: 'normal',
        textAlign: 'left',
        padding: '15px 20px',
        width: '25%',
      },
      topMatter: {
        position: 'relative',
      },
      filterTool: {
        position: 'absolute',
        top: '0px',
        right: '0px',
        width: '40%',
      },
      dateFilter: {
        width: '25%',
      },
      reportButton: {
        margin: '5px 0px',
        float: 'right',
      },
      clear: {
        clear: 'both',
      }
    };
  }

  constructor() {
    super();
    this.state = {
      searchVal: null,
      openSettings: null,
      selectedTab: 'unscheduled',
      filterDate: new Date(),
      toggleReportWindow: false,
    };

    this.closeSettings = this.closeSettings.bind(this);
  }

  componentWillMount() {
    window.addEventListener('click', this.closeSettings);
    this.props.canvasRequest(loadCustomData, {
      user_id: this.props.lmsUserId,
      ns: 'edu.au.exam',
      scope: '/exam/proctor_code'
    });
    this.props.loadExamRequests(this.props.currentAccountId);
    this.props.testingCentersAccountSetup(
      this.props.currentAccountId,
      this.props.toolConsumerInstanceName
    );
  }


  componentWillUpdate(nextProps) {
    if (!this.props.needProctorCode && nextProps.needProctorCode) {
      // a random code between 7 and 8 digits, this will go a way once u4 finishes their stuff.
      // it will look something like b9f25fc4
      const code = Math.random().toString(16).substring(7);
      this.props.canvasRequest(storeCustomData, {
        user_id: this.props.lmsUserId,
      }, {
        ns: 'edu.au.exam',
        scope: '/exam/proctor_code',
        data: code
      });
      this.props.showModal(
        <NewProctorCode code={code} hideModal={this.props.hideModal} />
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.closeSettings);
  }

  onDownload(startDate, endDate) {
    this.props.exportExamsAsCSV(this.props.currentAccountId, startDate, endDate);
  }

  getExamRequestRows() {
    const options = {
      shouldSort: false,
      threshold: 0.5,
      keys: [
        'student_name',
        'course_name',
        'exam_name',
        'status',
      ]
    };
    // it might be useful also to search the student id but fuse doesnt search numbers
    // so we would need to add a value to the each item in the list when it comes
    // back from the database called like sortable id that is just the string of the
    // student id. If we decide we want that then we can do it.
    let renderList = this.props.examRequestList;
    if (this.state.searchVal && this.state.searchVal !== '') {
      const fuse = new Fuse(this.props.examRequestList, options);
      renderList = fuse.search(this.state.searchVal);
    }

    renderList = this.tabFilter(renderList);
    return _.map(renderList, examRequest => (
      <ExamRequest
        key={`proctor_${examRequest.id}`}
        examRequest={examRequest}
        examRequestList={this.props.examRequestList}
        scheduleExam={(id, date, time) => this.scheduleExam(id, date, time)}
        sendMessage={(id, body, subject) => this.sendMessage(id, body, subject)}
        showModal={this.props.showModal}
        hideModal={this.props.hideModal}
        startExam={this.props.startExam}
        enterAnswers={this.props.enterAnswers}
        finishExam={this.props.finishExam}
        openSettings={(e, id) => this.openSettings(e, id)}
        settingsOpen={this.state.openSettings === examRequest.id}
        getSignedUrl={this.props.getSignedUrl}
      />
    ));
  }

  getTopControls(styles) {
    if (this.state.selectedTab === 'date') {
      return (
        <DateFilter
          style={{ ...styles.filterTool, ...styles.dateFilter }}
          onChange={filterDate => this.setState({ filterDate })}
          date={this.state.filterDate}
        />
      );
    }

    return (
      <SearchBar
        style={styles.filterTool}
        searchChange={e => this.setState({ searchVal: e.target.value })}
      />
    );
  }

  getUnscheduledCount() {
    return _.filter(
      this.props.examRequestList,
      examRequest => (!examRequest.scheduled_date && examRequest.status !== 'finished')
    ).length;
  }

  openSettings(e, id) {
    e.stopPropagation();
    this.setState({ openSettings: id });
  }

  closeSettings() {
    if (this.state.openSettings != null) {
      this.setState({ openSettings: null });
    }
  }

  scheduleExam(id, scheduledDate, scheduledTime) {
    const body = {
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      status: 'scheduled',
    };
    this.props.scheduleExam(id, body);
  }

  tabFilter(examRequestList) {
    if (this.state.selectedTab === 'date') {
      // search by date
      return _.filter(examRequestList, examRequest => (
        moment(examRequest.scheduled_date).isSame(this.state.filterDate, 'day') &&
        examRequest.status !== 'finished'
      ));
    } else if (this.state.selectedTab === 'unscheduled') {
      const list = _.filter(examRequestList, examRequest => (
        !examRequest.scheduled_date && examRequest.status !== 'finished'
      ));
      return _.orderBy(list, examRequest => moment(examRequest.created_at).toDate());
    }

    return examRequestList;
  }

  sendMessage(id, body, subject) {
    const payload = {
      student_id: _.toString(id),
      proctor_id: this.props.lmsUserId,
      subject,
      body,
    };
    this.props.createProctorConversation(payload);
  }

  toggleReportWindow() {
    this.props.showModal(
      <ReportWindow
        onCancel={() => this.props.hideModal()}
        onDownload={(...args) => this.onDownload(...args)}
      />
    );
  }

  render() {
    const styles = BaseExamRequestList.getStyles();
    return (
      <div>
        <div style={styles.reportButton}>
          <ReportButton
            text="Report"
            onExport={() => this.toggleReportWindow()}
          />
        </div>
        <div style={styles.clear} />
        <div style={styles.topMatter}>
          {this.getTopControls(styles)}
          <FilterTabs
            changeTab={selectedTab => this.setState({ selectedTab })}
            selectedTab={this.state.selectedTab}
            unscheduledCount={this.getUnscheduledCount()}
          />
        </div>
        <table style={styles.table}>
          <thead style={styles.tr}>
            {BaseExamRequestList.tableHeader(styles)}
          </thead>
          <tbody>
            {this.getExamRequestRows()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(select, {
  ...ExamRequestActions,
  ...ModalActions,
  canvasRequest,
})(BaseExamRequestList);
