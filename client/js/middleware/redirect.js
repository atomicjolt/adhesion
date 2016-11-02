import { Constants as PackageConstants }   from "../actions/scorm";
import { DONE }    from "../constants/wrapper";

const Redirect = store => next => action => {
  switch(action.type){
    case PackageConstants.PREVIEW_PACKAGE_DONE:
    case PackageConstants.LOAD_LAUNCH_URL_DONE:
      window.open(action.payload.response);
      break;
  }

  // call the next middleWare
  next(action);

};

export { Redirect as default };
