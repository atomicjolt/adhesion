import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Actions that make an api request
const requests = [
  'ASSIGN_EXAM',
  'REASSIGN_EXAM',
  'LOAD_ASSIGNED_EXAMS'
];

export const Constants = wrapper([], requests);

export const loadAssignedExams = examId => ({
  method: Network.GET,
  type: Constants.LOAD_ASSIGNED_EXAMS,
  url: '/api/assigned_exams',
  params: { exam_id: examId }
});

export const assignExam = body => ({
  method: Network.POST,
  type: Constants.ASSIGN_EXAM,
  url: '/api/assigned_exams',
  body
});

export const reassignExam = (assignedExamId, body) => ({
  method: Network.PUT,
  type: Constants.REASSIGN_EXAM,
  url: `/api/assigned_exams/${assignedExamId}`,
  body
});