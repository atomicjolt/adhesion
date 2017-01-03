import { saveAs }                           from 'file-saver';

const Download = store => next => (action) => {
  console.log(action.type) // eslint-disable-line no-unused-vars
  if (action.type === 'DOWNLOAD_FILE_DONE') {
    debugger
    const blob = new Blob([action.response.text], { type: 'text/csv' });
    saveAs(blob, 'export.csv');
  }
  next(action);
};

export default Download;
