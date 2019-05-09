import { Constants } from '../actions/application';

const initialState = {
  pdfDownloadUrl: null,
  documentName: null,
};

export default (state = initialState, action) => {
  switch (action.type) {

    case Constants.GET_SESSION_STATUS_DONE: {
      let {
        pdf_download_url:pdfDownloadUrl,
        document_name:documentName,
      } = action.payload;

      if (!pdfDownloadUrl) {
        pdfDownloadUrl = state.pdfDownloadUrl;
      }

      if (!documentName) {
        documentName = state.documentName;
      }

      return {
        ...state,
        pdfDownloadUrl,
        documentName,
      };
    }

    default:
      return state;

  }
};
