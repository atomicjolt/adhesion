import { Constants as PackageConstants } from '../actions/scorm';

const Redirect = store => next => (action) => { // eslint-disable-line no-unused-vars
  switch (action.type) {
    case PackageConstants.PREVIEW_PACKAGE_DONE:
    case PackageConstants.LOAD_LAUNCH_URL_DONE:
      window.open(action.payload.response);
      break;

    default:
      break;
  }

  // call the next middleWare
  next(action);
};

export { Redirect as default };
