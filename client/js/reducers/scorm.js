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
        scormList: action.payload,
        shouldRefreshList: false
      }; //TODO check if always is an array

    case PackageConstants.REMOVE_PACKAGE_DONE:
    case PackageConstants.UPLOAD_PACKAGE_DONE:
      return {...state, shouldRefreshList: true};

    default:
      return state;
  }
};
