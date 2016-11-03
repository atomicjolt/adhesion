import { Constants as PackageConstants }   from "../actions/scorm";
import { DONE }    from "../constants/wrapper";

const Writeback = store => next => action => {
  switch(action.type){
    case "CREATE_ASSIGNMENT_DONE":
      
      break;
  }

  // call the next middleWare
  next(action);

};

export { Writeback as default };
