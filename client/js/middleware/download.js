import { saveAs } from 'file-saver';
import { DONE } from '../constants/wrapper';
import { Constants as AttendanceConstants } from '../attendance/actions/attendance';

const Download = store => next => (action) => { // eslint-disable-line no-unused-vars
  if (action.type === AttendanceConstants.DOWNLOAD_FILE + DONE) {
    const blob = new Blob([action.response.text], { type: 'text/csv' });
    saveAs(blob, 'export.csv');
  }
  next(action);
};

export default Download;
