import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [
  'REMOVE_ERROR',
  'UPDATE_IMPORT_TYPE',
];

// Actions that make an api request
const requests = [
  'LOAD_PACKAGES',
  'UPLOAD_PACKAGE',
  'REMOVE_PACKAGE',
  'UPDATE_UPLOAD_FILE',
  'PREVIEW_PACKAGE',
  'UPDATE_PACKAGE',
  'REPLACE_PACKAGE',
  'POLL_STATUS',
];

export const Constants = wrapper(actions, requests);

export const updateImportType = (index, importType) => ({
  type: Constants.UPDATE_IMPORT_TYPE,
  index,
  importType,
});

export const loadPackages = lmsCourseId => ({
  method: Network.GET,
  type: Constants.LOAD_PACKAGES,
  url: '/api/scorm_courses',
  params: { lms_course_id: lmsCourseId },
});

export const pollStatus = scormCourseId => ({
  method: Network.GET,
  type: Constants.POLL_STATUS,
  url: `/api/scorm_courses/${scormCourseId}/status`,
});

export const uploadPackage = (file, lmsCourseId) => {
  const form = new FormData();
  form.append('file', file);
  return {
    method: Network.POST,
    type: Constants.UPLOAD_PACKAGE,
    url: '/api/scorm_courses',
    body: form,
    params: { lms_course_id: lmsCourseId },
    upload: file,
    timeout: 10000000
  };
};

export const removePackage = courseId => ({
  method: Network.DEL,
  type: Constants.REMOVE_PACKAGE,
  url: `/api/scorm_courses/${courseId}`,
  courseId,
});

export const previewPackage = courseId => ({
  method: Network.GET,
  type: Constants.PREVIEW_PACKAGE,
  url: `/api/scorm_courses/${courseId}/preview`,
});

export const updatePackage = (courseId, body = {}, lmsCourseId, index) => ({
  method: Network.PUT,
  type: Constants.UPDATE_PACKAGE,
  url: `/api/scorm_courses/${courseId}`,
  body,
  lmsCourseId,
  index,
});

export const replacePackage = (file, courseId, lmsCourseId, index) => {
  const form = new FormData();
  form.append('file', file);
  return {
    method: Network.POST,
    type: Constants.REPLACE_PACKAGE,
    url: `/api/scorm_courses/${courseId}/replace`,
    body: form,
    upload: file,
    params: { lms_course_id: lmsCourseId, index },
    timeout: 10000000
  };
};

export const removeError = () => ({
  type: Constants.REMOVE_ERROR,
});
