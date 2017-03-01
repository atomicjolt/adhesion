import React                   from 'react';
import { connect }             from 'react-redux';
import _                       from 'lodash';
import Fuse                    from 'fuse.js';
import moment                  from 'moment';
import * as ExamRequestActions from '../../actions/exam_requests';
import * as ModalActions       from '../../../actions/modal';
import Defines                 from '../../defines';
import ExamRequest             from './exam_request';
import SearchBar               from './search_bar';
import DateFilter              from './date_filter';
import canvasRequest           from '../../../libs/canvas/action';
import { createConversation }  from '../../../libs/canvas/constants/conversations';
import FilterTabs              from './filter_tabs';
import ReportWindow            from './report_window';
import ReportButton            from './report_button';

const select = state => ({
  lmsUserId: state.settings.lms_user_id,
  currentAccountId: state.settings.custom_canvas_account_id,
  toolConsumerInstanceName: state.settings.tool_consumer_instance_name,
  examRequestList: state.examRequests.examRequestList,
  centerIdError: state.examRequests.centerIdError,
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
      }, reportButton: {
        margin: '10px 0px',
        left: '90.5%',
        position: 'relative',
      }
    };
  }

  constructor() {
    super();
    this.state = {
      searchVal: null,
      openSettings: null,
      selectedTab: 'date',
      filterDate: new Date(),
      toggleReportWindow: false,
    };
  }

  componentWillMount() {
    this.props.loadExamRequests(this.props.currentAccountId);
    this.props.testingCentersAccountSetup(
      this.props.currentAccountId,
      this.props.toolConsumerInstanceName
    );
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
        openSettings={id => this.setState({ openSettings: id })}
        settingsOpen={this.state.openSettings === examRequest.id}
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
      examRequest => (!examRequest.scheduled_date)
    ).length;
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
        moment(examRequest.scheduled_date).isSame(this.state.filterDate, 'day')
      ));
    } else if (this.state.selectedTab === 'unscheduled') {
      return _.filter(examRequestList, examRequest => (!examRequest.scheduled_date));
    }

    return examRequestList;
  }


  sendMessage(id, body, subject) {
    const payload = {
      recipients: [_.toString(id)],
      subject,
      body,
    };
    this.props.canvasRequest(createConversation, {}, payload);
  }

  onReport() {
    this.setState({toggleReportWindow: !this.state.toggleReportWindow})
  }

  onDownload() {
    this.onReport();

    // start the download here
  }

  toggleReportWindow() {
    if (this.state.toggleReportWindow) {
      return <ReportWindow
        onCancel={() => this.onReport()}
        onDownload={() => this.onDownload()}
      />
    }
    return null;
  }

  render() {
    const styles = BaseExamRequestList.getStyles();
    return (
      <div>
        <div style={styles.reportButton}>
          <ReportButton
            text="Report"
            onExport={() => this.onReport()}
          />
        </div>
        {this.toggleReportWindow()}
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
