import wrapper from '../../constants/wrapper';
import Network from '../../constants/network';

// Actions that make an api request
const requests = [
  'LOAD_EXAM_REQUESTS',
  'SCHEDULE_EXAM',
  'TESTING_CENTERS_ACCOUNT_SETUP',
  'GET_SIGNED_URL',
  'START_EXAM',
  'DOWNLOAD_FILE',
  'FINISH_EXAM',
  'CREATE_PROCTOR_CONVERSATION'
];

export const Constants = wrapper([], requests);

export const loadExamRequests = testingCenterId => ({
  method: Network.GET,
  type: Constants.LOAD_EXAM_REQUESTS,
  url: '/api/exam_requests',
  params: { testing_center_id: testingCenterId }
});

export const scheduleExam = (id, body) => ({
  method: Network.PUT,
  type: Constants.SCHEDULE_EXAM,
  url: `/api/exam_requests/${id}`,
  body
});

export const testingCentersAccountSetup = (accountId, instanceName) => ({
  method: Network.POST,
  type: Constants.TESTING_CENTERS_ACCOUNT_SETUP,
  url: '/api/testing_centers_accounts',
  params: { testing_centers_account_id: accountId, canvas_instance_name: instanceName }
});

export const exportExamsAsCSV = (accountId, startDate, endDate) => ({
  method: Network.GET,
  type: Constants.DOWNLOAD_FILE,
  url: '/exports/export_exams_as_csv',
  params: { testing_centers_account_id: accountId, start: startDate, end: endDate },
  filename: 'exams.csv'
});

export const getSignedUrl = (id, newWindow) => ({
  method: Network.GET,
  type: Constants.GET_SIGNED_URL,
  url: '/api/proctor_login',
  params: { id },
  newWindow
});

export const startExam = id => ({
  method: Network.PUT,
  type: Constants.START_EXAM,
  url: `/api/exam_requests/${id}`,
  body: {
    status: 'started'
  }
});

export const enterAnswers = id => ({
  method: Network.PUT,
  type: Constants.START_EXAM,
  url: `/api/exam_requests/${id}`,
  body: {
    status: 'entering answers'
  }
});

export const finishExam = id => ({
  method: Network.PUT,
  type: Constants.FINISH_EXAM,
  url: `/api/exam_requests/${id}`,
  body: {
    status: 'finished'
  }
});

export const createProctorConversation = body => ({
  method: Network.POST,
  type: Constants.CREATE_PROCTOR_CONVERSATION,
  url: '/api/proctor_conversations',
  body
});
