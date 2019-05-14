import { Constants } from '../actions/application';

const initialState = {
  pdfDownloadUrl: null,
  documentName: null,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case Constants.GET_SESSION_STATUS_DONE: {
      const {
        pdf_download_url:pdfDownloadUrl,
        document_name:documentName,
      } = action.payload;

      return {
        ...state,
        ...(pdfDownloadUrl ? { pdfDownloadUrl } : {}),
        ...(documentName ? { documentName } : {}),
      };
    }

    default:
      return state;

  }
};
