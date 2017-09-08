import * as ApplicationActions from '../actions/application';
import application from './application';

describe('application reducer', () => {
  describe('initial state', () => {
    it('returns empty state', () => {
      const initialState = {};
      const state = application(initialState, {});
      expect(state).toEqual({});
    });
  });

  describe('update date', () => {
    it('updates date', () => {
      const nextDate = '2016-1-2';
      const priorState = { date: '2016-1-1' };
      const result = application(priorState, ApplicationActions.changeDate(nextDate));
      expect(result.date, nextDate);
    });
  });
});
