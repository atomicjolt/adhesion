import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Local actions
const actions = [
  'REMOVE_ERROR',
  'UPDATE_IMPORT_TYPE',
];

// Actions that make an api request
const requests = [
  'ASSIGN_EXAM',
  'LOAD_ASSIGNED_EXAMS'
];

export const Constants = wrapper(actions, requests);

export const assignExam = body => ({
  method: Network.POST,
  type: Constants.ASSIGN_EXAM,
  url: '/api/assigned_exams',
  body
});
