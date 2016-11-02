import { Constants as PackageConstants }   from "../actions/scorm";
import _                                   from 'lodash';

const initialState = {
  scormList: [],
  shouldRefreshList: false
};

export default (state = initialState, action) => {
  switch(action.type){

    case PackageConstants.LOAD_PACKAGES_DONE:
      return {
        ...state,
        scormList: action.payload.response,
        shouldRefreshList: false,
        file: null
      }; //TODO check if always is an array

    case PackageConstants.UPLOAD_PACKAGE:
      let file = action.upload;
      let showUpload = true;
      return {...state, showUploading: showUpload, file: file};

    case PackageConstants.REMOVE_PACKAGE_DONE:
    case PackageConstants.UPLOAD_PACKAGE_DONE:
      if (action.error) {
        return {...state, file: action.original.upload, uploadError: true}
      } else {
        return {...state, shouldRefreshList: true};
      }

    case PackageConstants.UPDATE_UPLOAD_FILE:
      // TODO: need to update state with response (this is for error)
      return {...state, file: action.file};

    case PackageConstants.REMOVE_ERROR:
      delete state.file;
      delete state.uploadError;
      return {...state, file: null, uploadError: false};

    default:
      return state;
  }
};
