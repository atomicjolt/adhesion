import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import {
  deleteAssignment, listAssignmentsAssignments, editAssignment
} from 'atomic-canvas/libs/constants/assignments';
import canvasRequest from 'atomic-canvas/libs/action';
import * as ScormActions  from '../../actions/scorm';
import CoursesList from './courses_list';
import ConnectedUploader from './uploader';
import FileUpload from '../common/file_upload';
import * as ModalActions from '../../../../libs/actions/modal';

export class ScormIndex extends React.Component {

  static propTypes = {
    loadPackages: PropTypes.func,
    canvasRequest: PropTypes.func,
    removePackage: PropTypes.func,
    uploadPackage: PropTypes.func,
    updatePackage: PropTypes.func,
    previewPackage: PropTypes.func,
    replacePackage: PropTypes.func,
    updateImportType: PropTypes.func,
    removeError: PropTypes.func,
    lmsCourseId: PropTypes.string,
    scormList: PropTypes.arrayOf(PropTypes.object),
    canvasAssignments: PropTypes.shape({}),
    listAssignmentsDone: PropTypes.bool,
    shouldRefreshList: PropTypes.bool,
    scormCourseId: PropTypes.number,
    apiUrl: PropTypes.string,
    scormFile: PropTypes.shape({}),
    canvasUrl: PropTypes.string.isRequired,
    loadError: PropTypes.bool,
    hideModal: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
    location: PropTypes.shape({
      query: PropTypes.shape({
        noSync: PropTypes.string,
      }),
    }),
  };

  constructor() {
    super();
    this.state = {
      synced: false,
    };
  }

  componentWillMount() {
    this.props.loadPackages(this.props.lmsCourseId);
    this.props.canvasRequest(
      listAssignmentsAssignments,
      { course_id: this.props.lmsCourseId },
    );
  }

  componentDidUpdate() {
    if (this.props.shouldPollStatus) {
      _.delay(() => {
        this.props.pollStatus(this.props.scormCourseId);
      }, 5000);
    }
    if (this.props.shouldRefreshList) {
      this.props.loadPackages(this.props.lmsCourseId);
    }
    if (!this.state.synced && this.props.scormList &&
        this.props.listAssignmentsDone) {
      this.synchronize();
    }
  }

  synchronize() {
    if (this.props.location && !this.props.location.query.noSync) {
      _.forEach(this.props.scormList, (scorm) => {
        const canvasAssignment = _.findKey(
          this.props.canvasAssignments,
          assignment => assignment.id === scorm.lms_assignment_id,
        );
        if (!canvasAssignment && scorm.grading_type != null) {
          this.props.removePackage(scorm.id);
        }
      });
    }
    this.setState({ synced: true });
  }

  createAssignment(packageId, assignmentName, packageIndex, gradingType, pointsPossible = 0) {
    const data = {
      assignment: {
        name: assignmentName,
        points_possible: pointsPossible,
        grading_type: gradingType,
      },
    };

    this.props.updatePackage(
      packageId,
      {
        points_possible: pointsPossible,
        scorm_assignment_data: data,
      },
      this.props.lmsCourseId,
      packageIndex,
    );
  }

  deleteAssignment(assignmentId, packageId) {
    this.props.removePackage(packageId);
    if (!assignmentId) { return; }
    this.props.canvasRequest(
      deleteAssignment,
      { course_id: this.props.lmsCourseId, id: assignmentId },
    );
  }

  uploadPackage(file) {
    this.props.removeError();
    this.props.uploadPackage(file, this.props.lmsCourseId);
  }

  publishAssignment(assignmentId, publishedState) {
    this.props.canvasRequest(
      editAssignment,
      { course_id: this.props.lmsCourseId, id: assignmentId },
      { assignment: {
        published: publishedState,
      } },
    );
  }

  render() {
    if (this.props.loadError) {
      return (
        <div className="c-error__message">
          Something went wrong. We apologize for the inconvenience.
        </div>
      );
    }
    if (!this.state.synced) {
      return (
        <div className="o-main-contain">
          <h2>Loading...</h2>
        </div>
      );
    }
    const uploader = this.props.scormFile ? <ConnectedUploader /> : null;
    return (
      <div className="o-main-contain">

        <div className="c-header">
          <h1 className="c-header__title">SCORM</h1>
          <div className="c-header__btns" >
            <FileUpload
              uploadPackage={file => this.uploadPackage(file)}
            />
          </div>
        </div>

        { uploader }

        <CoursesList
          list={this.props.scormList}
          canvasList={this.props.canvasAssignments}
          courseId={this.props.lmsCourseId}
          canvasUrl={this.props.canvasUrl}
          removePackage={(...args) => this.deleteAssignment(...args)}
          previewPackage={this.props.previewPackage}
          replacePackage={this.props.replacePackage}
          importPackage={(...args) => this.createAssignment(...args)}
          updateImportType={this.props.updateImportType}
          showModal={this.props.showModal}
          hideModal={this.props.hideModal}
          publishPackage={(...args) => this.publishAssignment(...args)}
        />

      </div>
    );
  }
}

const select = (state) => {
  const courseList = state.scorm.scormList ? _.orderBy(state.scorm.scormList, 'index', 'desc') : null;
  return {
    lmsCourseId: state.settings.lms_course_id,
    userId: state.settings.user_id,
    apiUrl: state.settings.api_url,
    scormList: courseList,
    shouldRefreshList: state.scorm.shouldRefreshList,
    shouldPollStatus: state.scorm.shouldPollStatus,
    scormCourseId: state.scorm.scormCourseId,
    scormFile: state.scorm.file,
    loadError: state.scorm.loadError,
    canvasAssignments: state.scorm.canvasAssignments,
    listAssignmentsDone: state.scorm.listAssignmentsDone,
    canvasUrl: state.settings.custom_canvas_api_domain,
  };
};

export default connect(select, {
  ...ScormActions,
  ...ModalActions,
  canvasRequest,
})(ScormIndex);
