import { loadPackages, Constants as PackageConstants } from '../actions/scorm';

const Writeback = store => next => (action) => {
  switch (action.type) {
    case PackageConstants.UPDATE_PACKAGE_DONE:
      store.dispatch(loadPackages(action.original.lmsCourseId));
      break;
    default:
      break;

  }

  // call the next middleWare
  next(action);
};

export { Writeback as default };
