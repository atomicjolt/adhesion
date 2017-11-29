import wrapper from 'atomic-fuel/libs/constants/wrapper';
import Network from 'atomic-fuel/libs/constants/network';

// Local actions
const actions = [];

// Actions that make an api request
const requests = [
  'CREATE_STUDENT_INFO',
];

export const Constants = wrapper(actions, requests);

export const createStudentInfo = (sections, assignmentId, type) => ({
  type: Constants.CREATE_STUDENT_INFO,
  method: Network.POST,
  url: 'api/submissions/',
  params: {
    assignment_id: assignmentId
  },
  body: {
    sections,
    type,
  }
});
