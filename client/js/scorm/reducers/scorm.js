import { Constants as PackageConstants }   from "../actions/scorm";

const initialState = {
  scormList: [],
  shouldRefreshList: false
};

export default (state = initialState, action) => {
  switch(action.type){

    case PackageConstants.UPDATE_IMPORT_TYPE:
      var updatedScorm = {...state.scormList[action.index]};
      updatedScorm.importType = action.importType;
      var updatedScormList = state.scormList.slice(0);
      updatedScormList[action.index] = updatedScorm;
      return {...state, scormList: updatedScormList};

    case PackageConstants.LOAD_PACKAGES_DONE:
      return {
        ...state,
        scormList: action.payload.response.map((item, index) => {
          item.index = index;
          return item;
        }),
        shouldRefreshList: false,
        file: null
      };

    case PackageConstants.UPLOAD_PACKAGE:
      let file = action.upload;
      let showUpload = true;
      return {...state, showUploading: showUpload, file};

    case PackageConstants.REMOVE_PACKAGE_DONE:
    case PackageConstants.UPLOAD_PACKAGE_DONE:
      if (action.error) {
        return {...state, file: action.original.upload, uploadError: true};
      } else {
        return {...state, file: null, shouldRefreshList: true};
      }

    case PackageConstants.UPDATE_UPLOAD_FILE:
      return {...state, file: action.file};

    case PackageConstants.REMOVE_ERROR:
      return {...state, file: null, uploadError: false};

    default:
      return state;
  }
};
