import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [
  'SWITCH_VIEW',
];

// Actions that make an api request
const requests = [
  'LOAD_COURSE_DATA',
  'LOAD_USER_DATA',
  'LOAD_ACTIVITY_DATA',
];

export const Constants = wrapper(actions, requests);

export const loadCourseData = courseId => ({
  method: Network.GET,
  type: Constants.LOAD_COURSE_DATA,
  url: `/api/scorm_courses/${courseId}/course_report`,
  courseId,
});

export const loadUserData = (courseId, userId) => ({
  method: Network.GET,
  type: Constants.LOAD_USER_DATA,
  url: `/api/scorm_courses/${courseId}/student_report`,
  params: { user_id: userId },
  userId,
});

export const loadActivityData = courseId => ({
  method: Network.GET,
  type: Constants.LOAD_ACTIVITY_DATA,
  url: `/api/scorm_courses/${courseId}/activity_report`,
  courseId,
});

export const switchView = (view, viewId) => ({
  type: Constants.SWITCH_VIEW,
  view,
  viewId,
});
