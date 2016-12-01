import _ from 'lodash';
import { Constants as PackageConstants } from '../actions/scorm';

const initialState = {
  scormList: null,
  shouldRefreshList: false,
  canvasAssignments: null,
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
    case 'LIST_ASSIGNMENTS_DONE':
      return { ...state, canvasAssignments: action.payload };

    case PackageConstants.UPDATE_IMPORT_TYPE: {
      const updatedScorm = { ...state.scormList[action.index] };
      updatedScorm.is_graded = action.importType;
      const updatedScormList = state.scormList.slice();
      updatedScormList[action.index] = updatedScorm;
      return { ...state, scormList: updatedScormList };
    }
    case PackageConstants.LOAD_PACKAGES_DONE:
      return {
        ...state,
        scormList: action.payload.response.map((item, index) => ({ ...item, index })),
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

    default:
      return state;
  }
};
