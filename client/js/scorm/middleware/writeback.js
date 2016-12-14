import { loadPackages, updatePackage, Constants as PackageConstants } from '../actions/scorm';

const Writeback = store => next => (action) => {
  switch (action.type) {
    case 'CREATE_ASSIGNMENT_DONE':
      store.dispatch(updatePackage(
        action.payload.integration_id,
        {
          lms_assignment_id: action.payload.id,
          points_possible: action.payload.points_possible,
        },
        action.original.params.course_id,
      ));
      break;
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
