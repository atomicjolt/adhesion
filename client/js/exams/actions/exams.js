import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Actions that make an api request
const requests = [
  'ASSIGN_EXAM',
  'UNASSIGN_EXAM',
  'REASSIGN_EXAM',
  'LOAD_ASSIGNED_EXAMS',
  'DOWNLOAD_FILE'
];

const actions = [
  'CLEAR_STATE',
];

export const Constants = wrapper(actions, requests);

export const loadAssignedExams = studentId => ({
  method: Network.GET,
  type: Constants.LOAD_ASSIGNED_EXAMS,
  url: '/api/assigned_exams',
  params: { student_id: studentId }
});

export const requestExam = body => ({
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
