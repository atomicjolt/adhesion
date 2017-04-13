import * as ExamRequestsActions from '../actions/exam_requests';
import examRequests from './exam_requests';
import moment from 'moment';

describe('applications reducer', () => {
  describe('initial state', () => {
    it('returns empty state', () => {
      const initialState = {};
      const state = examRequests(initialState, {});
      expect(state).toEqual({});
    });
  });

  describe('get examRequests', () => {
    it('makes a GET request for loadExamRequests', () => {
      const state = undefined;
      const testingCenterId = 12;
      const payload = [];
      const request = ExamRequestsActions.loadExamRequests(testingCenterId);

      expect(request).toBeDefined();
      expect(request.url).toBe('/api/exam_requests');
      expect(request.params.testing_center_id).toBe(testingCenterId);

      const results = examRequests(state, {
        type: 'LOAD_EXAM_REQUESTS_DONE',
        payload
      });
      expect(results.examRequestList).toEqual(payload);
    });

    it('makes a PUT request for scheduleExam', () => {
      const scheduleId = 2;
      const payloadId = 3;
      const state = { examRequestList: [ { id: payloadId } ] }
      const body = {};
      const payload = { id: payloadId, config: 'new_config' };
      const request = ExamRequestsActions.scheduleExam(scheduleId, body);

      expect(request).toBeDefined();
      expect(request.url).toBe(`/api/exam_requests/${scheduleId}`);
      expect(request.body).toBe(body);

      const results = examRequests(state, {
        type: 'FINISH_EXAM_DONE',
        payload
      });
      expect(results.examRequestList[0]).toEqual(payload);
    });

    it('makes a POST request for testingCentersAccountSetup', () => {
      const accountId = 2;
      const state = {};
      const instanceName = 'instanceName';
      const request = ExamRequestsActions.testingCentersAccountSetup(accountId, instanceName);

      expect(request).toBeDefined();
      expect(request.url).toBe(`/api/testing_centers_accounts`);
      expect(request.params.canvas_instance_name).toBe(instanceName);
      expect(request.params.testing_centers_account_id).toBe(accountId);

      const results = examRequests(state, {
        type: 'TESTING_CENTERS_ACCOUNT_SETUP_DONE'
      });
      expect(results).toEqual(state);
    });

    it('makes a GET request for exportExamsAsCSV', () => {
      const accountId = 2;
      const startDate = moment('2010-10-20').toDate();
      const endDate = moment('2010-10-21').toDate();
      const state = {};
      const request = ExamRequestsActions.exportExamsAsCSV(accountId, startDate, endDate);

      expect(request).toBeDefined();
      expect(request.url).toBe(`/exports/export_exams_as_csv`);
      expect(request.params.testing_centers_account_id).toBe(accountId);
      expect(request.params.start).toBe(startDate);
      expect(request.params.end).toBe(endDate);
    });

    it('makes a GET request for getSignedUrl', () => {
      const state = {};
      const id = 2;
      const newWindow = 'newWindow';
      const request = ExamRequestsActions.getSignedUrl(id, newWindow);
      const signedUrl = 'www.example.com';

      expect(request).toBeDefined();
      expect(request.url).toBe(`/api/proctor_login`);
      expect(request.params.id).toBe(id);
      expect(request.newWindow).toBe(newWindow);

      const results = examRequests(state, {
        type: 'GET_SIGNED_URL_DONE',
        payload: { signed_url: signedUrl }
      });
      expect(results.signedUrl).toEqual(signedUrl);
    });

    it('makes a PUT request for startExam', () => {
      const state = {};
      const id = 2;
      const request = ExamRequestsActions.startExam(id);

      expect(request).toBeDefined();
      expect(request.url).toBe(`/api/exam_requests/${id}`);
      expect(request.body.status).toBe('started');
    });

    it('makes a PUT request for enterAnswers', () => {
      const state = {};
      const id = 2;
      const request = ExamRequestsActions.enterAnswers(id);

      expect(request).toBeDefined();
      expect(request.url).toBe(`/api/exam_requests/${id}`);
      expect(request.body.status).toBe('entering answers');
    });

    it('makes a PUT request for finishExam', () => {
      const state = {};
      const id = 2;
      const request = ExamRequestsActions.finishExam(id);

      expect(request).toBeDefined();
      expect(request.url).toBe(`/api/exam_requests/${id}`);
      expect(request.body.status).toBe('finished');
    });

    it('makes a POST request for createProctorConversation', () => {
      const state = {};
      const body = { id: 2 };
      const request = ExamRequestsActions.createProctorConversation(body);

      expect(request).toBeDefined();
      expect(request.url).toBe(`/api/proctor_conversations`);
      expect(request.body).toEqual(body);
    });
  });
});
