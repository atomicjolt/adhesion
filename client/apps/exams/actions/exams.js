import wrapper from '../../../libs/constants/wrapper';
import Network from '../../../libs/constants/network';

// Actions that make an api request
const requests = [
  'REQUEST_EXAM',
  'UNASSIGN_EXAM',
  'REASSIGN_EXAM',
  'LOAD_EXAM_REQUESTS',
  'DOWNLOAD_FILE'
];

const actions = [
  'CLEAR_STATE',
];

export const Constants = wrapper(actions, requests);

export const loadExamRequests = studentId => ({
  method: Network.GET,
  type: Constants.LOAD_EXAM_REQUESTS,
  url: '/api/exam_requests',
  params: { student_id: studentId }
});

export const requestExam = body => ({
  method: Network.POST,
  type: Constants.REQUEST_EXAM,
  url: '/api/exam_requests',
  body
});

export const reassignExam = (assignedExamId, body) => ({
  method: Network.PUT,
  type: Constants.REASSIGN_EXAM,
  url: `/api/assigned_exams/${assignedExamId}`,
  body
});

export const unassignExam = assignedExamId => ({
  method: Network.DEL,
  type: Constants.UNASSIGN_EXAM,
  url: `/api/assigned_exams/${assignedExamId}`,
});

export const downloadExamStatus = (examId, courseId) => ({
  method: Network.GET,
  type: Constants.DOWNLOAD_FILE,
  url: '/download_status',
  params: { exam_id: examId, course_id: courseId }
});

export const clearState = () => ({
  type: Constants.CLEAR_STATE,
});
