import Error from './error';
import { Constants as ErrorConstants } from '../actions/error';

describe('error reducer', () => {
  it('returns an error message', () => {
    const action = {
      type: ErrorConstants.ERROR,
      response: {
        status: 'Danger Will Robinson!',
      },
      error: true,
    };

    const state = Error(null, action);

    expect(state.showError).toBeTruthy();
    expect(state.statusCode).toContain('Danger Will Robinson!');
  });
});
