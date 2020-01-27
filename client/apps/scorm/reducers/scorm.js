import _ from 'lodash';
import { Constants as PackageConstants } from '../actions/scorm';

const initialState = {
  scormList: null,
  loadError: false,
  uploadError: false,
  shouldRefreshList: false,
  listAssignmentsDone: false,
  canvasAssignments: null,
  file: null,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'EDIT_ASSIGNMENT': {
      const newState = _.cloneDeep(state);
      newState
        .canvasAssignments[action.params.id]
        .published = action.body.assignment.published;
      return { ...newState };
    }
    case 'UPDATE_PACKAGE_DONE': {
      const updatedScorm = { ...state.scormList[action.original.index] };
      const updatedScormList = state.scormList.slice();
      updatedScormList[action.original.index] = updatedScorm;
      const updatedAssignments = state.canvasAssignments;
      updatedAssignments[action.payload.lms_assignment.id] = action.payload.lms_assignment;
      return { ...state, scormList: updatedScormList, canvasAssignments: updatedAssignments };
    }
    case 'LIST_ASSIGNMENTS_ASSIGNMENTS_DONE': {
      const newState = _.cloneDeep(state);
      const updatedAssignments = newState.canvasAssignments;
      if (!updatedAssignments) newState.canvasAssignments = {};
      _.forEach(action.payload, (assignment) => {
        newState.canvasAssignments[assignment.id] = assignment;
      });
      return { ...newState, listAssignmentsDone: action.lastPage };
    }
    case PackageConstants.UPDATE_IMPORT_TYPE: {
      const updatedScorm = { ...state.scormList[action.index] };
      updatedScorm.grading_type = action.importType;
      const updatedScormList = state.scormList.slice();
      updatedScormList[action.index] = updatedScorm;
      return { ...state, scormList: updatedScormList };
    }
    case PackageConstants.LOAD_PACKAGES_DONE:
      if (action.error) {
        return { ...state, loadError: true };
      }
      return {
        ...state,
        scormList: _.map(action.payload.response, (item, index) => (
          {
            ...item,
            fetching: item.importing === true,
            index,
          }
        )),
        shouldRefreshList: false,
        file: null,
      };

    case PackageConstants.UPLOAD_PACKAGE: {
      const file = action.upload;
      return { ...state, file };
    }
    case PackageConstants.REMOVE_PACKAGE: {
      const newState = _.cloneDeep(state);
      _.remove(newState.scormList, scorm => scorm.id === action.courseId);
      return newState;
    }

    case PackageConstants.REMOVE_PACKAGE_DONE:
    case PackageConstants.UPLOAD_PACKAGE_DONE: {
      if (action.error) {
        const errorText = action.error.rawResponse || action.error.message;
        return {
          ...state,
          file: action.original.upload,
          uploadError: true,
          errorText,
        };
      }
      const scormCourseId = action.payload ? action.payload.scorm_course_id : null;
      const shouldPollStatus = !!scormCourseId;
      return { ...state, scormCourseId, shouldPollStatus };
    }
    case PackageConstants.POLL_STATUS_DONE: {
      const {
        status,
        message,
      } = action.payload;

      let {
        scorm_course_id:scormCourseId,
      } = action.payload;

      if (!scormCourseId) {
        scormCourseId = state.scormCourseId;
      }

      const shouldPollStatus = !_.includes(['COMPLETE', 'FAILED'], status);
      let shouldRefreshList = !shouldPollStatus;
      let errorText = '';
      let uploadError = false;
      if (status === 'FAILED') {
        uploadError = true;
        errorText = `${status} - ${message}`;
        shouldRefreshList = false;
      }
      return {
        ...state,
        scormCourseId,
        shouldPollStatus,
        shouldRefreshList,
        uploadError,
        errorText,
      };
    }
    case PackageConstants.UPDATE_UPLOAD_FILE:
      return { ...state, file: action.file };

    case PackageConstants.REMOVE_ERROR:
      return { ...state, file: null, uploadError: false };

    case PackageConstants.REPLACE_PACKAGE: {
      const updatedPackage = { ...state.scormList[action.params.index] };
      updatedPackage.fetching = true;
      const updatedScormList = state.scormList.slice();
      updatedScormList[action.params.index] = updatedPackage;
      return { ...state, scormList: updatedScormList };
    }

    case PackageConstants.REPLACE_PACKAGE_DONE: {
      const scormCourseId = action.payload ? action.payload.scorm_course_id : null;
      const shouldPollStatus = !!scormCourseId;
      return { ...state, scormCourseId, shouldPollStatus };
    }

    default:
      return state;
  }
};
