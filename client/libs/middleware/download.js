import { saveAs }                           from 'file-saver';

const Download = store => next => (action) => { // eslint-disable-line no-unused-vars
  if (action.type === 'DOWNLOAD_FILE_DONE') {
    if (action.response.body === null || !action.response.body.large_file) {
      const blob = new Blob([action.response.text], { type: 'text/csv' });
      saveAs(blob, action.original.filename);
    }
  }
  next(action);
};

export default Download;
