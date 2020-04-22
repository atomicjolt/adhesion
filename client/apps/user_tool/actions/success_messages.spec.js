import { clearSuccessMessages } from './success_messages';

describe('success messages actions', () => {
  describe('clearSuccessMessages', () => {
    it('generates the correct action', () => {
      const expectedAction = {
        type: 'CLEAR_SUCCESS_MESSAGES',
      };

      expect(clearSuccessMessages())
        .toEqual(expectedAction);
    });
  });
});
