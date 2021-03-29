import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  'GET_SUBMISSION',
  'GET_LAST_SUBMISSION',
];

export const Constants = wrapper(actions, requests);

export const getSubmission = (courseId, assignmentId, studentId, submissionId) => ({
  method: Network.GET,
  type: Constants.GET_SUBMISSION,
  url: '/api/assignment_submissions',
  params: {
    course_id: courseId,
    assignment_id: assignmentId,
    user_id: studentId,
    submission_id: submissionId
  }
});
