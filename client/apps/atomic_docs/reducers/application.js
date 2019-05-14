import { Constants } from '../actions/application';

const initialState = {
  pdfDownloadUrl: null,
  documentName: null,
  sessionError: false,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case Constants.GET_SESSION_STATUS_DONE: {
      const {
        pdf_download_url:pdfDownloadUrl,
        document_name:documentName,
      } = action.payload;

      let sessionError = false;

      if (action.error && action.error.status === 403) {
        sessionError = true;
      }

      return {
        ...state,
        ...(pdfDownloadUrl ? { pdfDownloadUrl } : {}),
        ...(documentName ? { documentName } : {}),
        sessionError,
      };
    }

    default:
      return state;

  }
};
