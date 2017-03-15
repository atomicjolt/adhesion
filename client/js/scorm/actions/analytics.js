import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Local actions
const actions = [
  'SWITCH_VIEW',
];

// Actions that make an api request
const requests = [
  'LOAD_COURSE_DATA',
  'LOAD_USER_DATA',
];

export const Constants = wrapper(actions, requests);

export const loadCourseData = courseId => ({
  method: Network.GET,
  type: Constants.LOAD_COURSE_DATA,
  url: `/api/scorm_courses/${courseId}/course_report`,
  courseId,
});

export const getUserData = (courseId, userId) => ({
  method: Network.GET,
  type: Constants.LOAD_USER_DATA,
  url: `/api/scorm_courses/${courseId}/student_report`,
  params: { user_id: userId },
  userId,
});

export const switchView = (view, viewId) => ({
  type: Constants.SWITCH_VIEW,
  view,
  viewId,
});
