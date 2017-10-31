import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Actions that make an api request
const requests = [
  'MARK_COURSE_AS_COMPLETED'
];

export const Constants = wrapper([], requests);

export const markCourseAsCompleted = courseId => ({
  type: Constants.MARK_COURSE_AS_COMPLETED,
  method: Network.POST,
  url: 'api/course_completions',
  params: {
    course_id: courseId,
  }
});
