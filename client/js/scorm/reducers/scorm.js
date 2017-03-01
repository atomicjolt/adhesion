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

    case 'CREATE_ASSIGNMENT': {
      const updatedScorm = { ...state.scormList[action.localData.index] };
      updatedScorm.fetching = true;
      const updatedScormList = state.scormList.slice();
      updatedScormList[action.localData.index] = updatedScorm;
      return { ...state, scormList: updatedScormList };
    }
    case 'CREATE_ASSIGNMENT_DONE': {
      const updatedScorm = { ...state.scormList[action.original.localData.index] };
      updatedScorm.fetching = false;
      const updatedScormList = state.scormList.slice();
      updatedScormList[action.original.localData.index] = updatedScorm;
      return { ...state, scormList: updatedScormList };
    }
    case 'LIST_ASSIGNMENTS_DONE': {
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
      updatedScorm.is_graded = action.importType;
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
        scormList: _.map(action.payload.response, (item, index) => ({ ...item, index })),
        shouldRefreshList: false,
        file: null,
      };

    case PackageConstants.UPLOAD_PACKAGE: {
      const file = action.upload;
      const showUpload = true;
      return { ...state, showUploading: showUpload, file };
    }
    case PackageConstants.REMOVE_PACKAGE: {
      const newState = _.cloneDeep(state);
      _.remove(newState.scormList, scorm => scorm.id === action.courseId);
      return newState;
    }

    case PackageConstants.REMOVE_PACKAGE_DONE:
    case PackageConstants.UPLOAD_PACKAGE_DONE: {
      if (action.error) {
        return { ...state, file: action.original.upload, uploadError: true };
      }
      return { ...state, file: null, shouldRefreshList: true };
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

    case PackageConstants.REPLACE_PACKAGE_DONE:
      return { ...state, shouldRefreshList: true };

    default:
      return state;
  }
};
