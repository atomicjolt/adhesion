import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import * as ScormActions from '../../actions/scorm';
import CoursesList from './courses_list';
import ConnectedUploader from './uploader';
import {
  create_assignment as createAssignment,
  delete_assignment as deleteAssignment,
  list_assignments as listAssignments,
} from '../../../libs/canvas/constants/assignments';
import canvasRequest from '../../../libs/canvas/action';
import FileUpload from '../common/file_upload';

export class ScormIndex extends React.Component {

  static propTypes = {
    loadPackages: React.PropTypes.func,
    canvasRequest: React.PropTypes.func,
    removePackage: React.PropTypes.func,
    uploadPackage: React.PropTypes.func,
    previewPackage: React.PropTypes.func,
    updateImportType: React.PropTypes.func,
    removeError: React.PropTypes.func,
    lmsCourseId: React.PropTypes.string,
    scormList: React.PropTypes.arrayOf(React.PropTypes.object),
    canvasAssignments: React.PropTypes.arrayOf(React.PropTypes.object),
    shouldRefreshList: React.PropTypes.bool,
    apiUrl: React.PropTypes.string,
    scormFile: React.PropTypes.shape({
      name: React.PropTypes.string,
    }),
  };

  constructor() {
    super();
    this.state = {
      synced: false,
    };
  }

  componentDidMount() {
    this.props.loadPackages();
    this.props.canvasRequest(
      listAssignments,
      { course_id: this.props.lmsCourseId },
    );
  }

  componentDidUpdate() {
    if (this.props.shouldRefreshList) {
      this.props.loadPackages();
    }
    if (!this.state.synced && this.props.scormList && this.props.canvasAssignments) {
      this.synchronize();
    }
  }

  synchronize() {
    _.forEach(this.props.scormList, (scorm) => {
      const canvasAssignment = _.find(
        this.props.canvasAssignments,
        assignment => assignment.id === scorm.lms_assignment_id,
      );
      if (!canvasAssignment && scorm.is_graded != null) {
        this.props.removePackage(scorm.id);
      }
    });
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
          url: `${this.props.apiUrl}scorm_course?course_id=${packageId}`,
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
    this.props.uploadPackage(file);
  }

  render() {
    if (!this.state.synced) {
      return null;
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
          removePackage={(...args) => this.deleteAssignment(...args)}
          previewPackage={this.props.previewPackage}
          importPackage={(...args) => this.createAssignment(...args)}
          updateImportType={this.props.updateImportType}
        />

      </div>
    );
  }
}

const select = (state) => {
  const courseList = state.scorm.scormList ? _.orderBy(state.scorm.scormList, 'index', 'desc') : null;
  return {
    lmsCourseId: state.settings.lmsCourseId,
    userId: state.settings.userId,
    apiUrl: state.settings.apiUrl,
    scormList: courseList,
    shouldRefreshList: state.scorm.shouldRefreshList,
    scormFile: state.scorm.file,
    uploadError: state.scorm.uploadError,
    canvasAssignments: state.scorm.canvasAssignments,
  };
};

export default connect(select, { ...ScormActions, canvasRequest })(ScormIndex);
