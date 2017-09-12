import * as ExamsActions from '../actions/exams';
import exams from './exams';

describe('exams reducer', () => {
  describe('initial state', () => {
    it('returns empty state', () => {
      const initialState = {};
      const state = exams(initialState, {});
      expect(state).toEqual({});
    });
  });

  describe('get examRequests', () => {
    it('makes a GET request for loadExamRequests', () => {
      const state = undefined;
      const studentId = 12;
      const payload = [];
      const request = ExamsActions.loadExamRequests(studentId);

      expect(request).toBeDefined();
      expect(request.url).toBe('/api/exam_requests');
      expect(request.params.student_id).toBe(studentId);

      const results = exams(state, {
        type: 'LOAD_EXAM_REQUESTS_DONE',
        payload
      });
      expect(results.ready).toBe(true);
    });
  });
});
