import { saveAs }                           from 'file-saver';

const Download = store => next => (action) => { // eslint-disable-line no-unused-vars
  if (action.type === 'DOWNLOAD_FILE_DONE' || action.type === 'EXPORT_EXAMS_AS_CSV_DONE') {
    const blob = new Blob([action.response.text], { type: 'text/csv' });
    saveAs(blob, 'export.csv');
  }
  next(action);
};

export default Download;
