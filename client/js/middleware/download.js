import { DONE }    from "../constants/wrapper";
import {Constants as AttendanceConstants } from '../attendance/actions/attendance';
import {saveAs} from 'file-saver';

const Download = store => next => action => {
  if(action.type == AttendanceConstants.DOWNLOAD_FILE + DONE){
    const blob = new Blob([action.response.text], {type:'text/csv'});
    saveAs(blob, "export.csv");
  }
  next(action);
};

export default Download;
