import wrapper    from "../constants/wrapper";
import Network    from '../constants/network';

// Local actions
const actions = [
];

// Actions that make an api request
const requests = [
  "LOAD_PACKAGES",
  "LOAD_LAUNCH_URL",
  "UPLOAD_PACKAGE",
  "REMOVE_PACKAGE",
  "UPDATE_UPLOAD_FILE",
  "PREVIEW_PACKAGE",
  "IMPORT_PACKAGE"
];

export const Constants = wrapper(actions, requests);

export const loadPackages = () => ({
  method: Network.GET,
  type: Constants.LOAD_PACKAGES,
  url: '/api/courses'
});

//TODO use studentID
export const loadLaunchUrl = (courseId, studentId) => ({
  method: Network.GET,
  type: Constants.LOAD_LAUNCH_URL,
  url: `/api/courses/${courseId}/launch`
});

export const uploadPackage = (file) => {
  var form = new FormData();
  form.append('filename', file);
  return {
    method: Network.POST,
    type: Constants.UPLOAD_PACKAGE,
    url: `/api/courses`,
    body: form,
    upload: file
  };
};

export const removePackage = (courseId) => ({
  method: Network.DEL,
  type: Constants.REMOVE_PACKAGE,
  url: `/api/courses/${courseId}`
});

// TODO add redirect_url
export const previewPackage = (courseId) => ({
  method: Network.GET,
  type: Constants.PREVIEW_PACKAGE,
  url: `/api/courses/${courseId}/preview`
});

export const importPackage = (courseId) => ({
  method: Network.GET,
  type: Constants.IMPORT_PACKAGE,
  url: `api/courses/${courseId}/import`
});
