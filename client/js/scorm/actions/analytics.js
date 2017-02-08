import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Local actions
const actions = [
];

// Actions that make an api request
const requests = [
  'LOAD_COURSE_DATA',
];

export const Constants = wrapper(actions, requests);

export const loadCourseData = courseId => ({
  method: Network.GET,
  type: Constants.LOAD_COURSE_DATA,
  url: `/api/scorm_courses/${courseId}/course_report`,
  courseId,
});
