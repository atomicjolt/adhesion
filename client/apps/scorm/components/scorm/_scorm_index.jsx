import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as ScormActions  from '../../actions/scorm';
import CoursesList from './courses_list';
import ConnectedUploader from './uploader';
import {
  createAssignment, deleteAssignment, listAssignments, editAssignment
} from 'atomic-canvas/libs/constants/assignments';
import canvasRequest from 'atomic-canvas/libs/action';
import FileUpload from '../common/file_upload';
import * as ModalActions from 'atomic-fuel/libs/actions/modal';

export class ScormIndex extends React.Component {

  static propTypes = {
    loadPackages: React.PropTypes.func,
    canvasRequest: React.PropTypes.func,
    removePackage: React.PropTypes.func,
    uploadPackage: React.PropTypes.func,
    previewPackage: React.PropTypes.func,
    replacePackage: React.PropTypes.func,
    updateImportType: React.PropTypes.func,
    removeError: React.PropTypes.func,
    lmsCourseId: React.PropTypes.string,
    scormList: React.PropTypes.arrayOf(React.PropTypes.object),
    canvasAssignments: React.PropTypes.shape({}),
    listAssignmentsDone: React.PropTypes.bool,
    shouldRefreshList: React.PropTypes.bool,
    apiUrl: React.PropTypes.string,
    scormFile: React.PropTypes.shape({}),
    canvasUrl: React.PropTypes.string.isRequired,
    loadError: React.PropTypes.bool,
    hideModal: React.PropTypes.func.isRequired,
    showModal: React.PropTypes.func.isRequired,
    location: React.PropTypes.shape({
      query: React.PropTypes.shape({
        noSync: React.PropTypes.string,
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
      listAssignments,
      { course_id: this.props.lmsCourseId },
    );
  }

  componentDidUpdate() {
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
        if (!canvasAssignment && scorm.is_graded != null) {
          this.props.removePackage(scorm.id);
        }
      });
    }
    this.setState({ synced: true });
  }

  createAssignment(packageId, assignmentName, packageIndex, pointsPossible = 0) {
    const query = {
      assignment: {
        name: assignmentName,
        submission_types: ['external_tool'],
        integration_id: `${packageId}`,
        integration_data: { provider: 'atomic-scorm' },
        external_tool_tag_attributes: {
          url: `${this.props.apiUrl}scorm_courses?course_id=${packageId}`,
        },
        points_possible: pointsPossible,
      },
    };

    this.props.canvasRequest(
      createAssignment,
      { course_id: this.props.lmsCourseId },
      query,
      { index: packageIndex },
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
    scormFile: state.scorm.file,
    loadError: state.scorm.loadError,
    uploadError: state.scorm.uploadError,
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
