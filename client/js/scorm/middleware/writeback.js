import * as PackageActions from "../actions/scorm";
import { Constants as PackageConstants }   from "../actions/scorm";
import { DONE }    from "../../constants/wrapper";

const Writeback = store => next => action => {
  switch(action.type){
    case "CREATE_ASSIGNMENT_DONE":
      const state = store.getState();
      store.dispatch(PackageActions.updatePackage(
        action.payload.integration_id,
        {
          lms_assignment_id: action.payload.id,
          points_possible: action.payload.points_possible
        }
      ));
      break;
    case PackageConstants.UPDATE_PACKAGE_DONE:
      store.dispatch(PackageActions.loadPackages());
      break;

  }

  // call the next middleWare
  next(action);

};

export { Writeback as default };
