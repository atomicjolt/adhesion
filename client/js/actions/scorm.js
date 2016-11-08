import wrapper    from "../constants/wrapper";
import Network    from '../constants/network';

// Local actions
const actions = [
  "REMOVE_ERROR"
];

// Actions that make an api request
const requests = [
  "LOAD_PACKAGES",
  // "LOAD_LAUNCH_URL",
  "UPLOAD_PACKAGE",
  "REMOVE_PACKAGE",
  "UPDATE_UPLOAD_FILE",
  "PREVIEW_PACKAGE",
  // "IMPORT_PACKAGE",
  "UPDATE_PACKAGE"
];

export const Constants = wrapper(actions, requests);

export const loadPackages = () => ({
  method: Network.GET,
  type: Constants.LOAD_PACKAGES,
  url: '/api/scorm_courses'
});

// export const loadLaunchUrl = (courseId, studentId) => ({
//   method: Network.GET,
//   type: Constants.LOAD_LAUNCH_URL,
//   url: `/api/scorm_courses/${courseId}/launch`
// });

export const uploadPackage = (file) => {
  var form = new FormData();
  form.append('file', file);
  return {
    method: Network.POST,
    type: Constants.UPLOAD_PACKAGE,
    url: `/api/scorm_courses`,
    body: form,
    upload: file
  };
};

export const removePackage = (courseId) => ({
  method: Network.DEL,
  type: Constants.REMOVE_PACKAGE,
  url: `/api/scorm_courses/${courseId}`
});

export const previewPackage = (courseId) => ({
  method: Network.GET,
  type: Constants.PREVIEW_PACKAGE,
  url: `/api/scorm_courses/${courseId}/preview`
});

export const updatePackage = (courseId, body = {}) => ({
  method: Network.PUT,
  type: Constants.UPDATE_PACKAGE,
  url: `/api/scorm_courses/${courseId}`,
  body
});

export const removeError = () => ({
  type: Constants.REMOVE_ERROR
});
